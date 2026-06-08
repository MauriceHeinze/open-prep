export const PROMPTS_PER_PAGE = 10;

export type PaginationItem =
  | {
      type: 'page';
      page: number;
    }
  | {
      type: 'ellipsis';
      key: string;
    };

const createPageItem = (page: number): PaginationItem => ({
  type: 'page',
  page,
});

export const buildPaginationItems = (
  totalPages: number,
  currentPage: number,
): PaginationItem[] => {
  if (totalPages <= 0) {
    return [];
  }

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => createPageItem(index + 1));
  }

  if (currentPage <= 4) {
    return [
      createPageItem(1),
      createPageItem(2),
      createPageItem(3),
      createPageItem(4),
      createPageItem(5),
      { type: 'ellipsis', key: 'end-gap' },
      createPageItem(totalPages),
    ];
  }

  if (currentPage >= totalPages - 3) {
    return [
      createPageItem(1),
      { type: 'ellipsis', key: 'start-gap' },
      createPageItem(totalPages - 4),
      createPageItem(totalPages - 3),
      createPageItem(totalPages - 2),
      createPageItem(totalPages - 1),
      createPageItem(totalPages),
    ];
  }

  return [
    createPageItem(1),
    { type: 'ellipsis', key: 'start-gap' },
    createPageItem(currentPage - 1),
    createPageItem(currentPage),
    createPageItem(currentPage + 1),
    { type: 'ellipsis', key: 'end-gap' },
    createPageItem(totalPages),
  ];
};
