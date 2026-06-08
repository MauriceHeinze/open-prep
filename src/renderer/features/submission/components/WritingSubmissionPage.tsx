import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { EvaluationPendingState } from '@renderer/features/submission/components/EvaluationPendingState';
import { usePromptDetails } from '@renderer/features/submission/hooks/usePromptDetails';
import { resolvePublicAssetUrl } from '@renderer/lib/resolve-public-asset-url';

const discussionRoleLabels = {
  professor: 'Professor',
  student: 'Student',
} as const;

const renderScenarioNode = (node: ChildNode, key: string): ReactNode => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }

  if (!(node instanceof Element)) {
    return null;
  }

  const children = Array.from(node.childNodes).map((childNode, index) =>
    renderScenarioNode(childNode, `${key}-${index}`),
  );

  if (node.tagName === 'P') {
    return <p key={key}>{children}</p>;
  }

  if (node.tagName === 'UL') {
    return <ul key={key}>{children}</ul>;
  }

  if (node.tagName === 'LI') {
    return <li key={key}>{children}</li>;
  }

  return <span key={key}>{children}</span>;
};

const renderScenario = (scenario: string): ReactNode[] => {
  const parser = new DOMParser();
  const document = parser.parseFromString(scenario, 'text/html');

  return Array.from(document.body.childNodes).map((node, index) =>
    renderScenarioNode(node, `scenario-${index}`),
  );
};

const PromptDetailsSkeleton = (): JSX.Element => (
  <div className="grid gap-10 lg:grid-cols-[minmax(0,680px)_minmax(520px,680px)]">
    <Card className="border-border/80 shadow-[var(--shadow)]">
      <CardContent className="grid gap-4 pt-6">
        <Skeleton className="h-8 w-32 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
      </CardContent>
    </Card>
    <Card className="border-border/80 shadow-[var(--shadow)]">
      <CardContent className="grid gap-4 pt-6">
        <Skeleton className="h-8 w-36 rounded-xl" />
        <Skeleton className="h-[420px] rounded-2xl" />
        <Skeleton className="h-11 w-56 rounded-2xl" />
      </CardContent>
    </Card>
  </div>
);

export const WritingSubmissionPage = (): JSX.Element => {
  const { promptId } = useParams();
  const navigate = useNavigate();
  const { prompt, isLoading, errorMessage } = usePromptDetails(promptId);
  const [essayText, setEssayText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!prompt) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const attempt = await window.openPrepApi.submitWritingAttempt({
        promptId: prompt.id,
        essayText,
      });

      navigate(`/attempts/${attempt.id}`);
    } catch (error) {
      setSubmissionError((error as Error).message);
      setIsSubmitting(false);
    }
  };

  if (prompt && isSubmitting) {
    return (
      <main className="app-page app-page--evaluation-pending">
        <EvaluationPendingState />
      </main>
    );
  }

  return (
    <main className="app-page">
      <section className="mx-auto flex w-full max-w-[1408px] flex-col gap-8 pt-18">
        <Button asChild variant="ghost" className="w-fit">
          <Link to="/">
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2.2} data-icon="inline-start" />
            Back to prompts
          </Link>
        </Button>
        {isLoading ? <PromptDetailsSkeleton /> : null}
        {errorMessage ? (
          <Alert variant="destructive">
            <AlertTitle>Prompt unavailable</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}
        {prompt && !isSubmitting ? (
          <form
            className="grid items-start gap-10 lg:grid-cols-[minmax(0,680px)_minmax(520px,680px)]"
            onSubmit={handleSubmit}
          >
            <Card className="border-border/80 bg-card shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle className="text-3xl font-bold tracking-tight">Prompt</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-8">
                <div className="submission-scenario">{renderScenario(prompt.scenario)}</div>
                {prompt.discussionParticipants.length > 0 ? (
                  <div className="grid gap-5 pt-2" aria-label="Discussion thread">
                    {prompt.discussionParticipants.map((participant) => (
                      <article
                        key={`${participant.role}-${participant.name}`}
                        className="grid grid-cols-[48px_minmax(0,1fr)] gap-4 border-t border-border/70 pt-5 first:border-t-0 first:pt-0"
                      >
                        <Avatar className="size-12" size="lg">
                          <AvatarImage
                            src={resolvePublicAssetUrl(participant.avatarUrl)}
                            alt={participant.name}
                            loading="lazy"
                          />
                          <AvatarFallback>{participant.name.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <strong>{participant.name}</strong>
                            <Badge variant="secondary" className="rounded-full">
                              {discussionRoleLabels[participant.role]}
                            </Badge>
                          </div>
                          <p className="m-0 text-sm leading-6 text-foreground">
                            {participant.message}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>
            <Card className="border-border/80 bg-card shadow-[var(--shadow)] lg:sticky lg:top-[22px]">
              <CardHeader>
                <CardTitle className="text-3xl font-bold tracking-tight">Your text</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="essay-text">Response</Label>
                  <Textarea
                    id="essay-text"
                    className="h-[442px] min-h-[442px] rounded-[22px] bg-card px-7 py-6 text-sm leading-6 field-sizing-fixed"
                    aria-label="Your text"
                    value={essayText}
                    onChange={(event) => setEssayText(event.target.value)}
                  />
                </div>
                {submissionError ? (
                  <Alert variant="destructive">
                    <AlertTitle>Submission failed</AlertTitle>
                    <AlertDescription>{submissionError}</AlertDescription>
                  </Alert>
                ) : null}
                <Button
                  className="w-fit min-w-[210px] rounded-2xl text-base"
                  size="lg"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? 'Evaluating...' : 'Submit for evaluation'}
                </Button>
              </CardContent>
            </Card>
          </form>
        ) : null}
      </section>
    </main>
  );
};
