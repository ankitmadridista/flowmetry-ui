// Feature: invoice-list-ui, Property 2: Pagination button disabled states are consistent
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render, screen } from '@testing-library/react';
import { PaginationControls } from './PaginationControls';

/**
 * Validates: Requirements 6.3, 6.4, 6.7
 */
describe('PaginationControls property tests', () => {
  it('Property 2: pagination button disabled states are consistent with page and totalCount', () => {
    fc.assert(
      fc.property(
        fc.nat(),
        fc.integer({ min: 1, max: 100 }),
        fc.nat(),
        (page, pageSize, totalCount) => {
          const { unmount } = render(
            <PaginationControls
              page={page}
              pageSize={pageSize}
              totalCount={totalCount}
              onPageChange={() => {}}
              onPageSizeChange={() => {}}
            />
          );

          const prevBtn = screen.getByRole('button', { name: 'Previous' });
          const nextBtn = screen.getByRole('button', { name: 'Next' });

          const expectedPrevDisabled = page === 0 || totalCount === 0;
          const expectedNextDisabled = (page + 1) * pageSize >= totalCount || totalCount === 0;

          expect(prevBtn.hasAttribute('disabled')).toBe(expectedPrevDisabled);
          expect(nextBtn.hasAttribute('disabled')).toBe(expectedNextDisabled);

          if (totalCount === 0) {
            expect(screen.getByText('0 of 0 pages')).toBeInTheDocument();
          }

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
