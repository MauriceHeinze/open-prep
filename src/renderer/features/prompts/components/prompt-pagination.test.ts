import { describe, expect, it } from 'vitest';

import { buildPaginationItems } from './prompt-pagination';

const simplify = (
  items: ReturnType<typeof buildPaginationItems>,
): Array<number | 'ellipsis'> =>
  items.map((item) => (item.type === 'page' ? item.page : 'ellipsis'));

describe('buildPaginationItems', () => {
  it('returns every page when the total is small', () => {
    expect(simplify(buildPaginationItems(3, 1))).toEqual([1, 2, 3]);
  });

  it('shows a leading run near the start', () => {
    expect(simplify(buildPaginationItems(10, 2))).toEqual([1, 2, 3, 4, 5, 'ellipsis', 10]);
  });

  it('shows the current page in the middle with both ellipses', () => {
    expect(simplify(buildPaginationItems(10, 5))).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
  });

  it('shows a trailing run near the end', () => {
    expect(simplify(buildPaginationItems(10, 9))).toEqual([1, 'ellipsis', 6, 7, 8, 9, 10]);
  });
});
