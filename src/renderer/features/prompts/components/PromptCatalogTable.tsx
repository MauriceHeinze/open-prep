import type { KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowDown01Icon,
  ArrowReloadHorizontalIcon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem as ShadcnPaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { PromptSummary } from '@shared/domain/prompts/prompt-types';

import type { PaginationItem } from './prompt-pagination';
import type { PromptSortConfig, PromptSortDirection, PromptSortKey } from '../utils/sort-prompts';

const formatPromptType = (category: string): string =>
  category === 'Academic Discussion Question' ? 'Academic' : category;

const formatScore = (score: number | null): string =>
  score === null ? 'No score' : `${Math.round(score * 5)}/30`;

const formatStatus = (completedAt: string | null): string =>
  completedAt === null ? 'Not started' : 'Completed';

type SortableHeadingProps = {
  children: string;
  sortKey: PromptSortKey;
  activeKey: PromptSortConfig['key'];
  direction?: PromptSortDirection;
  onClick: (sortKey: PromptSortKey) => void;
};

const SortableHeading = ({
  children,
  sortKey,
  activeKey,
  direction,
  onClick,
}: SortableHeadingProps): JSX.Element => {
  const isActive = activeKey === sortKey;

  return (
    <Button
      className="h-auto justify-start gap-2 px-0 text-sm font-semibold"
      variant="ghost"
      size="sm"
      type="button"
      onClick={() => onClick(sortKey)}
      aria-label={`Sort by ${children}${isActive ? `, ${direction === 'asc' ? 'ascending' : 'descending'}` : ''}`}
    >
      <span>{children}</span>
      <HugeiconsIcon
        className={`size-4 text-primary transition ${isActive ? 'opacity-100' : 'opacity-40'} ${direction === 'desc' ? '' : 'rotate-180'}`}
        icon={ArrowDown01Icon}
        strokeWidth={2.2}
      />
    </Button>
  );
};

const PromptScore = ({ score }: { score: number | null }): JSX.Element => (
  <Badge
    className="min-w-24 justify-center rounded-full px-3 py-1"
    variant={score === null ? 'secondary' : 'default'}
    aria-label={score === null ? 'No score yet' : `Score ${formatScore(score)}`}
  >
    {formatScore(score)}
  </Badge>
);

type PromptCatalogTableProps = {
  currentPage: number;
  hasMultiplePages: boolean;
  onPageChange: (page: number) => void;
  onSort: (sortKey: PromptSortKey) => void;
  paginationItems: PaginationItem[];
  prompts: PromptSummary[];
  sortConfig: PromptSortConfig;
  totalPages: number;
};

export const PromptCatalogTable = ({
  currentPage,
  hasMultiplePages,
  onPageChange,
  onSort,
  paginationItems,
  prompts,
  sortConfig,
  totalPages,
}: PromptCatalogTableProps): JSX.Element => {
  const navigate = useNavigate();

  const handlePromptKeyDown = (
    event: KeyboardEvent<HTMLTableRowElement>,
    promptId: string,
  ): void => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    navigate(`/prompts/${promptId}`);
  };

  return (
    <Card className="border-border/80 bg-card shadow-[var(--shadow)]">
      <CardContent className="pt-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[280px]">
                <SortableHeading
                  sortKey="title"
                  activeKey={sortConfig.key}
                  direction={sortConfig.key === 'title' ? sortConfig.direction : undefined}
                  onClick={onSort}
                >
                  Prompt
                </SortableHeading>
              </TableHead>
              <TableHead className="min-w-[150px]">
                <SortableHeading
                  sortKey="category"
                  activeKey={sortConfig.key}
                  direction={sortConfig.key === 'category' ? sortConfig.direction : undefined}
                  onClick={onSort}
                >
                  Type
                </SortableHeading>
              </TableHead>
              <TableHead className="min-w-[140px]">
                <SortableHeading
                  sortKey="lastScore"
                  activeKey={sortConfig.key}
                  direction={sortConfig.key === 'lastScore' ? sortConfig.direction : undefined}
                  onClick={onSort}
                >
                  Score
                </SortableHeading>
              </TableHead>
              <TableHead className="min-w-[150px]">
                <SortableHeading
                  sortKey="lastCompletedAt"
                  activeKey={sortConfig.key}
                  direction={
                    sortConfig.key === 'lastCompletedAt' ? sortConfig.direction : undefined
                  }
                  onClick={onSort}
                >
                  Status
                </SortableHeading>
              </TableHead>
              <TableHead className="w-[145px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {prompts.length === 0 ? (
              <TableRow>
                <TableCell className="h-24 text-center text-muted-foreground" colSpan={5}>
                  No prompts match these filters.
                </TableCell>
              </TableRow>
            ) : null}
            {prompts.map((prompt) => {
              const isCompleted = prompt.lastCompletedAt !== null;

              return (
                <TableRow
                  key={prompt.id}
                  className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  tabIndex={0}
                  role="link"
                  aria-label={`Open prompt ${prompt.title}`}
                  onClick={() => navigate(`/prompts/${prompt.id}`)}
                  onKeyDown={(event) => handlePromptKeyDown(event, prompt.id)}
                >
                  <TableCell className="font-medium">{prompt.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-full">
                      {formatPromptType(prompt.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <PromptScore score={prompt.lastScore} />
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`rounded-full ${isCompleted ? 'prompt-status-badge--completed' : ''}`}
                      variant={isCompleted ? 'outline' : 'secondary'}
                    >
                      {formatStatus(prompt.lastCompletedAt)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" onClick={(event) => event.stopPropagation()}>
                    <Button
                      asChild
                      className="min-w-[104px] rounded-2xl"
                      size="lg"
                      variant="outline"
                    >
                      <Link to={`/prompts/${prompt.id}`}>
                        {isCompleted ? 'Retry' : 'Start'}
                        <HugeiconsIcon
                          icon={isCompleted ? ArrowReloadHorizontalIcon : ArrowRight01Icon}
                          strokeWidth={2.2}
                          data-icon="inline-end"
                        />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      {hasMultiplePages ? (
        <Pagination className="pb-6" aria-label="Prompt catalog pagination">
          <PaginationContent>
            <ShadcnPaginationItem>
              <PaginationPrevious
                href="#"
                text=""
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  onPageChange(Math.max(1, currentPage - 1));
                }}
              />
            </ShadcnPaginationItem>
            {paginationItems.map((item) =>
              item.type === 'page' ? (
                <ShadcnPaginationItem key={item.page}>
                  <PaginationLink
                    href="#"
                    isActive={item.page === currentPage}
                    aria-label={`Go to page ${item.page}`}
                    onClick={(event) => {
                      event.preventDefault();
                      onPageChange(item.page);
                    }}
                  >
                    {item.page}
                  </PaginationLink>
                </ShadcnPaginationItem>
              ) : (
                <ShadcnPaginationItem key={item.key}>
                  <PaginationEllipsis />
                </ShadcnPaginationItem>
              ),
            )}
            <ShadcnPaginationItem>
              <PaginationNext
                href="#"
                text=""
                aria-disabled={currentPage === totalPages}
                className={
                  currentPage === totalPages ? 'pointer-events-none opacity-50' : undefined
                }
                onClick={(event) => {
                  event.preventDefault();
                  onPageChange(Math.min(totalPages, currentPage + 1));
                }}
              />
            </ShadcnPaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </Card>
  );
};
