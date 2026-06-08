import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDown01Icon, Search01Icon, ShuffleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { usePromptCatalog } from '@renderer/features/prompts/hooks/usePromptCatalog';
import {
  getNextPromptSortConfig,
  sortPrompts,
  type PromptSortConfig,
  type PromptSortKey,
} from '@renderer/features/prompts/utils/sort-prompts';

import { PromptCatalogTable } from './PromptCatalogTable';
import { buildPaginationItems, PROMPTS_PER_PAGE } from './prompt-pagination';
import { pickRandomPrompt } from '../utils/pick-random-prompt';

type PromptTypeFilter = 'all' | 'email' | 'academic';
type PromptStatusFilter = 'all' | 'not-started' | 'completed';

const getPromptTypeFilter = (category: string): Exclude<PromptTypeFilter, 'all'> =>
  category === 'Academic Discussion Question' ? 'academic' : 'email';

const CatalogSkeleton = (): JSX.Element => (
  <Card className="border-border/80 shadow-[var(--shadow)]">
    <CardContent className="grid gap-3 pt-6">
      {[1, 2, 3, 4, 5].map((item) => (
        <Skeleton key={item} className="h-12 rounded-xl" />
      ))}
    </CardContent>
  </Card>
);

export const PromptCatalogPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { prompts, isLoading, errorMessage } = usePromptCatalog();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<PromptTypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<PromptStatusFilter>('all');
  const [sortConfig, setSortConfig] = useState<PromptSortConfig>({ key: 'default' });
  const filteredPrompts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase();

    return prompts.filter((prompt) => {
      const matchesType =
        typeFilter === 'all' || getPromptTypeFilter(prompt.category) === typeFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'completed' ? prompt.lastCompletedAt : !prompt.lastCompletedAt);
      const matchesSearch =
        normalizedQuery.length === 0 ||
        `${prompt.title} ${prompt.category}`.toLocaleLowerCase().includes(normalizedQuery);

      return matchesType && matchesStatus && matchesSearch;
    });
  }, [prompts, searchQuery, statusFilter, typeFilter]);
  const orderedPrompts = useMemo(
    () => sortPrompts(filteredPrompts, sortConfig),
    [filteredPrompts, sortConfig],
  );
  const totalPages = Math.max(1, Math.ceil(orderedPrompts.length / PROMPTS_PER_PAGE));

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter]);

  const visiblePrompts = useMemo(() => {
    const startIndex = (currentPage - 1) * PROMPTS_PER_PAGE;

    return orderedPrompts.slice(startIndex, startIndex + PROMPTS_PER_PAGE);
  }, [currentPage, orderedPrompts]);
  const paginationItems = useMemo(
    () => buildPaginationItems(totalPages, currentPage),
    [currentPage, totalPages],
  );
  const hasMultiplePages = totalPages > 1;

  const handleSort = (sortKey: PromptSortKey): void => {
    setSortConfig((currentSort) => getNextPromptSortConfig(currentSort, sortKey));
    setCurrentPage(1);
  };

  const handleRandomPrompt = (): void => {
    const randomPrompt = pickRandomPrompt(orderedPrompts);

    if (!randomPrompt) {
      return;
    }

    navigate(`/prompts/${randomPrompt.id}`);
  };

  return (
    <main className="app-page">
      <section className="mx-auto mt-10 flex w-full max-w-[1234px] flex-col gap-12">
        <Card className="border-border/80 bg-card shadow-[var(--shadow)]">
          <CardHeader className="gap-5">
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">Writing Practice</CardTitle>
              <p className="mt-2 text-base text-muted-foreground">
                Practice TOEFL®-style emails and academic discussion responses.
              </p>
            </div>
            <div className="grid gap-3 lg:grid-cols-[minmax(280px,1fr)_auto] lg:items-center">
              <div className="relative">
                <HugeiconsIcon
                  className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
                  icon={Search01Icon}
                  strokeWidth={2.2}
                />
                <Input
                  className="h-11 rounded-2xl bg-card pl-10"
                  type="search"
                  placeholder="Search prompts..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  aria-label="Search prompts"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Select
                    id="prompt-type-filter"
                    aria-label="Prompt type"
                    className="h-11 min-w-[135px] rounded-2xl bg-card"
                    value={typeFilter}
                    onChange={(event) => setTypeFilter(event.target.value as PromptTypeFilter)}
                  >
                    <option value="all">All types</option>
                    <option value="email">Email</option>
                    <option value="academic">Academic</option>
                  </Select>
                  <HugeiconsIcon
                    className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    icon={ArrowDown01Icon}
                    strokeWidth={2.2}
                  />
                </div>
                <div className="relative">
                  <Select
                    id="prompt-status-filter"
                    aria-label="Prompt status"
                    className="h-11 min-w-[145px] rounded-2xl bg-card"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value as PromptStatusFilter)}
                  >
                    <option value="all">All statuses</option>
                    <option value="not-started">Not started</option>
                    <option value="completed">Completed</option>
                  </Select>
                  <HugeiconsIcon
                    className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    icon={ArrowDown01Icon}
                    strokeWidth={2.2}
                  />
                </div>
                <Button
                  size="lg"
                  className="min-w-[157px] rounded-2xl"
                  type="button"
                  onClick={handleRandomPrompt}
                  disabled={isLoading || orderedPrompts.length === 0}
                >
                  Random prompt
                  <HugeiconsIcon icon={ShuffleIcon} strokeWidth={2.2} data-icon="inline-end" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
        {isLoading ? <CatalogSkeleton /> : null}
        {errorMessage ? (
          <Alert variant="destructive">
            <AlertTitle>Prompt catalog unavailable</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}
        {!isLoading && !errorMessage ? (
          <PromptCatalogTable
            currentPage={currentPage}
            hasMultiplePages={hasMultiplePages}
            onPageChange={setCurrentPage}
            onSort={handleSort}
            paginationItems={paginationItems}
            prompts={visiblePrompts}
            sortConfig={sortConfig}
            totalPages={totalPages}
          />
        ) : null}
      </section>
    </main>
  );
};
