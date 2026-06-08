import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft01Icon,
  ArrowReloadHorizontalIcon,
  ArrowRight01Icon,
  BulbIcon,
  FileEditIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useAttemptDetails } from '@renderer/features/evaluation/hooks/useAttemptDetails';
import { getNextPromptInCategory } from '@renderer/features/prompts/utils/get-next-prompt-in-category';
import type {
  WritingFeedbackHighlight,
  WritingCriterionKey,
  WritingHighlightCategory,
} from '@shared/domain/writing/writing-types';

const filterOptions: Array<{ label: string; value: WritingHighlightCategory }> = [
  { label: 'Grammar and Spelling', value: 'grammar-spelling' },
  { label: 'Idiomatic Word Choice', value: 'idiomatic-word-choice' },
  { label: 'Relevance to Discussion', value: 'relevance' },
  { label: 'Elaboration', value: 'elaboration' },
];

const criterionDisplayNames: Record<WritingCriterionKey, string> = {
  organization: 'Organization',
  grammarAndMechanics: 'Grammar & Mechanics',
  languageAccuracy: 'Language Accuracy',
  developmentAndSupport: 'Development & Support',
};

const getCefrLevel = (toeflScore: number): string => {
  if (toeflScore >= 6) {
    return 'C2';
  }

  if (toeflScore >= 5) {
    return 'C1';
  }

  if (toeflScore >= 4) {
    return 'B2';
  }

  if (toeflScore >= 3) {
    return 'B1';
  }

  if (toeflScore >= 2) {
    return 'A2';
  }

  if (toeflScore >= 1) {
    return 'A1';
  }

  return 'Below A1';
};

const getTone = (score: number): 'default' | 'secondary' | 'destructive' => {
  if (score >= 4) {
    return 'default';
  }

  if (score === 3) {
    return 'secondary';
  }

  return 'destructive';
};

const clampScoreRatio = (score: number, maxScore: number): number => {
  if (maxScore <= 0) {
    return 0;
  }

  return Math.min(Math.max(score / maxScore, 0), 1);
};

const formatScoreValue = (score: number): string =>
  Number.isInteger(score) ? score.toString() : score.toFixed(1);

const formatSubmittedDate = (submittedAt: string): string =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(submittedAt));

const getHighlightBounds = (
  essayText: string,
  highlight: WritingFeedbackHighlight,
): { start: number; end: number } | null => {
  const startOffset = Math.max(0, Math.min(highlight.startOffset, essayText.length));
  const endOffset = Math.max(startOffset, Math.min(highlight.endOffset, essayText.length));

  if (endOffset > startOffset) {
    return { start: startOffset, end: endOffset };
  }

  const fallbackStart = essayText.indexOf(highlight.excerpt);

  if (fallbackStart === -1) {
    return null;
  }

  return {
    start: fallbackStart,
    end: fallbackStart + highlight.excerpt.length,
  };
};

const renderAnnotatedEssay = (
  essayText: string,
  highlights: WritingFeedbackHighlight[],
  activeHighlightId: string | null,
  onHighlightSelect: (highlightId: string) => void,
): ReactNode => {
  if (highlights.length === 0) {
    return essayText;
  }

  const annotatedHighlights = highlights
    .map((highlight, index) => ({
      bounds: getHighlightBounds(essayText, highlight),
      highlight,
      index,
    }))
    .filter(
      (
        item,
      ): item is {
        bounds: { start: number; end: number };
        highlight: WritingFeedbackHighlight;
        index: number;
      } => item.bounds !== null,
    )
    .sort((first, second) => first.bounds.start - second.bounds.start);

  if (annotatedHighlights.length === 0) {
    return essayText;
  }

  const segments: ReactNode[] = [];
  let cursor = 0;

  annotatedHighlights.forEach(({ bounds, highlight, index }) => {
    if (bounds.start < cursor) {
      return;
    }

    const highlightedText = essayText.slice(bounds.start, bounds.end);
    const isActive = highlight.id === activeHighlightId;

    segments.push(essayText.slice(cursor, bounds.start));
    segments.push(
      <button
        key={`${highlight.id}-excerpt`}
        aria-pressed={isActive}
        className={`highlight-pill highlight-pill--muted highlight-pill--button${
          isActive ? ' highlight-pill--active' : ''
        }`}
        onClick={() => onHighlightSelect(highlight.id)}
        type="button"
      >
        {highlightedText} <span className="highlight-pill__count">[{index + 1}]</span>
      </button>,
    );
    segments.push(' ');
    segments.push(
      <span
        key={`${highlight.id}-replacement`}
        className={`highlight-pill${isActive ? ' highlight-pill--active' : ''}`}
      >
        {highlight.replacement}
      </span>,
    );
    cursor = bounds.end;
  });

  segments.push(essayText.slice(cursor));

  return segments;
};

type FeedbackPagerProps = {
  activeIndex: number;
  highlightCount: number;
  onNext: () => void;
  onPrevious: () => void;
};

const FeedbackPager = ({
  activeIndex,
  highlightCount,
  onNext,
  onPrevious,
}: FeedbackPagerProps): JSX.Element => {
  const canGoPrevious = activeIndex > 0;
  const canGoNext = activeIndex < highlightCount - 1;

  return (
    <div
      className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
      aria-label="Feedback item navigation"
    >
      <span className="min-w-11 text-right">
        {activeIndex + 1} of {highlightCount}
      </span>
      <Button
        aria-label="Previous feedback item"
        disabled={!canGoPrevious}
        onClick={onPrevious}
        size="icon-xs"
        type="button"
        variant="ghost"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
      </Button>
      <Button
        aria-label="Next feedback item"
        disabled={!canGoNext}
        onClick={onNext}
        size="icon-xs"
        type="button"
        variant="ghost"
      >
        <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
      </Button>
    </div>
  );
};

export const WritingEvaluationPage = (): JSX.Element => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { attempt, isLoading, errorMessage } = useAttemptDetails(attemptId);
  const [selectedFilters, setSelectedFilters] = useState<WritingHighlightCategory[]>([
    'idiomatic-word-choice',
  ]);
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(0);
  const [isStartingNextExercise, setIsStartingNextExercise] = useState(false);

  const filteredHighlights = useMemo(
    () =>
      [
        ...(attempt?.evaluation?.highlights.filter((highlight) =>
          selectedFilters.includes(highlight.category),
        ) ?? []),
      ].sort((first, second) => first.startOffset - second.startOffset),
    [attempt?.evaluation?.highlights, selectedFilters],
  );

  useEffect(() => {
    setActiveHighlightIndex(0);
  }, [filteredHighlights.length, selectedFilters]);

  const activeHighlight = filteredHighlights[activeHighlightIndex] ?? null;
  const submittedDate = attempt ? formatSubmittedDate(attempt.submittedAt) : '';
  const cefrLevel = attempt?.evaluation ? getCefrLevel(attempt.evaluation.overallScore) : '';
  const goToPreviousHighlight = (): void => {
    setActiveHighlightIndex((currentIndex) => Math.max(currentIndex - 1, 0));
  };
  const goToNextHighlight = (): void => {
    setActiveHighlightIndex((currentIndex) =>
      Math.min(currentIndex + 1, filteredHighlights.length - 1),
    );
  };
  const selectHighlight = (highlightId: string): void => {
    const selectedIndex = filteredHighlights.findIndex((highlight) => highlight.id === highlightId);

    if (selectedIndex !== -1) {
      setActiveHighlightIndex(selectedIndex);
    }
  };
  const startNextExercise = async (): Promise<void> => {
    if (!attempt || isStartingNextExercise) {
      return;
    }

    setIsStartingNextExercise(true);

    try {
      const promptCatalog = await window.openPrepApi.listPromptCatalog();
      const nextPrompt = getNextPromptInCategory(
        promptCatalog,
        attempt.prompt.id,
        attempt.prompt.category,
      );

      if (!nextPrompt) {
        setIsStartingNextExercise(false);
        return;
      }

      navigate(`/prompts/${nextPrompt.id}`);
    } catch {
      setIsStartingNextExercise(false);
    }
  };

  return (
    <main className="app-page">
      <section className="page-panel">
        <Button asChild className="w-fit" variant="ghost">
          <Link to="/">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} data-icon="inline-start" />
            Back to prompts
          </Link>
        </Button>
        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ) : null}
        {errorMessage ? (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}
        {attempt && attempt.evaluation ? (
          <div className="evaluation-layout grid gap-10">
            <div className="evaluation-layout__top">
              <h1>Your submission</h1>
              <div className="button-row">
                <Button variant="outline" type="button">
                  <HugeiconsIcon
                    icon={ArrowReloadHorizontalIcon}
                    strokeWidth={2}
                    data-icon="inline-start"
                  />
                  Repeat
                </Button>
                <Button onClick={startNextExercise} disabled={isStartingNextExercise} type="button">
                  <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} data-icon="inline-start" />
                  {isStartingNextExercise ? 'Starting next exercise...' : 'Start next exercise'}
                </Button>
              </div>
            </div>

            <div className="evaluation-grid">
              <Card className="prompt-card">
                <CardHeader>
                  <CardTitle>Prompt</CardTitle>
                  <CardDescription>{attempt.prompt.instructions}</CardDescription>
                </CardHeader>
                {attempt.prompt.question ? (
                  <CardContent className="grid gap-2">
                    <h3 className="m-0 text-sm font-semibold">Question:</h3>
                    <p className="m-0 text-sm leading-6 text-muted-foreground">
                      {attempt.prompt.question}
                    </p>
                  </CardContent>
                ) : null}
              </Card>

              <div className="grid h-full grid-cols-2 gap-4">
                <Card className="justify-center">
                  <CardHeader className="items-center text-center">
                    <CardTitle>TOEFL® Writing Score</CardTitle>
                    <div className="pt-4 text-5xl font-semibold tracking-normal">
                      {formatScoreValue(attempt.evaluation.overallScore)}
                      <span className="text-xl text-muted-foreground">
                        /{formatScoreValue(attempt.evaluation.overallMaxScore)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress
                      aria-label={`TOEFL® writing score ${formatScoreValue(
                        attempt.evaluation.overallScore,
                      )} out of ${formatScoreValue(attempt.evaluation.overallMaxScore)}`}
                      value={
                        clampScoreRatio(
                          attempt.evaluation.overallScore,
                          attempt.evaluation.overallMaxScore,
                        ) * 100
                      }
                    />
                  </CardContent>
                </Card>

                <Card className="justify-center">
                  <CardHeader className="items-center text-center">
                    <CardTitle>CEFR Level</CardTitle>
                    <div className="pt-4 text-5xl font-semibold tracking-normal">{cefrLevel}</div>
                    <CardDescription>Based on the TOEFL® writing score</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={FileEditIcon}
                      strokeWidth={2}
                      className="size-5 text-primary"
                    />
                    You on {submittedDate}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="m-0 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                    {attempt.essayText}
                  </p>
                </CardContent>
              </Card>

              <div className="score-card-grid">
                {attempt.evaluation.criterionScores.map((criterion) => (
                  <Card key={criterion.criterion} size="sm">
                    <CardHeader>
                      <CardTitle>{criterionDisplayNames[criterion.criterion]}</CardTitle>
                      <CardAction>
                        <Badge variant={getTone(criterion.score)}>
                          {criterion.score}/{criterion.maxScore}
                        </Badge>
                      </CardAction>
                      <CardDescription>{criterion.comment}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress
                        value={clampScoreRatio(criterion.score, criterion.maxScore) * 100}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <section className="feedback-section">
              <div>
                <h2>Detailed Feedback</h2>
                <p>
                  This section shows you recommendations on how to get your writing up by one point.
                </p>
              </div>
              <div className="feedback-grid">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={FileEditIcon}
                        strokeWidth={2}
                        className="size-5 text-primary"
                      />
                      You on {submittedDate}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="m-0 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                      {renderAnnotatedEssay(
                        attempt.essayText,
                        filteredHighlights,
                        activeHighlight?.id ?? null,
                        selectHighlight,
                      )}
                    </p>
                  </CardContent>
                </Card>

                <aside className="feedback-sidebar">
                  <Card size="sm">
                    <CardHeader>
                      <CardTitle>Filter</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        aria-label="Feedback filter"
                        className="grid grid-cols-2 gap-x-6 gap-y-3"
                        role="group"
                      >
                        {filterOptions.map((option) => {
                          const checkboxId = `feedback-filter-${option.value}`;

                          return (
                            <div key={option.value} className="flex items-center gap-2">
                              <Checkbox
                                checked={selectedFilters.includes(option.value)}
                                id={checkboxId}
                                onCheckedChange={(checked) => {
                                  const selectedValues = new Set(selectedFilters);

                                  if (checked) {
                                    selectedValues.add(option.value);
                                  } else {
                                    selectedValues.delete(option.value);
                                  }

                                  setSelectedFilters(
                                    filterOptions
                                      .filter((filterOption) =>
                                        selectedValues.has(filterOption.value),
                                      )
                                      .map((filterOption) => filterOption.value),
                                  );
                                }}
                              />
                              <Label className="text-sm font-normal leading-5" htmlFor={checkboxId}>
                                {option.label}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card size="sm">
                    {activeHighlight ? (
                      <>
                        <CardHeader>
                          <CardTitle>AI recommendation</CardTitle>
                          <CardAction>
                            <FeedbackPager
                              activeIndex={activeHighlightIndex}
                              highlightCount={filteredHighlights.length}
                              onNext={goToNextHighlight}
                              onPrevious={goToPreviousHighlight}
                            />
                          </CardAction>
                        </CardHeader>
                        <div aria-hidden="true" className="-mt-2 mb-2 h-px bg-border" />
                        <CardContent className="grid gap-6 text-sm leading-6 text-muted-foreground">
                          <div className="grid gap-3">
                            <h3 className="m-0 font-heading text-base font-medium text-foreground">
                              Why use{' '}
                              <span className="text-positive">{activeHighlight.replacement}</span>{' '}
                              instead of{' '}
                              <span className="text-negative">{activeHighlight.excerpt}</span>?
                            </h3>
                          </div>
                          <p className="m-0">{activeHighlight.explanation}</p>
                          <div className="grid gap-2">
                            <p className="m-0 font-semibold text-foreground">
                              Other formal alternatives:
                            </p>
                            <ul className="m-0 list-disc space-y-1 pl-5">
                              {activeHighlight.alternatives.map((alternative) => (
                                <li key={alternative}>{alternative}</li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                        <div aria-hidden="true" className="h-px bg-border" />
                        <CardContent>
                          <div className="feedback-tip">
                            <span className="feedback-tip__icon" aria-hidden="true">
                              <HugeiconsIcon icon={BulbIcon} strokeWidth={2.1} />
                            </span>
                            <p className="feedback-tip__body">
                              <strong>{attempt.prompt.examType.toUpperCase()} Tip:</strong>{' '}
                              {attempt.evaluation.nextStep}
                            </p>
                          </div>
                        </CardContent>
                      </>
                    ) : (
                      <CardContent>
                        Select one or more filters with matching feedback to see more details.
                      </CardContent>
                    )}
                  </Card>
                </aside>
              </div>
            </section>
          </div>
        ) : null}
      </section>
    </main>
  );
};
