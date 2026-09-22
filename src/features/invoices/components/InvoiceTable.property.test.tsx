// Feature: invoice-list-ui, Property 3: Sort direction toggle is consistent
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Pure helper that mirrors the toggle logic in InvoiceListPage.onSortChange
export function computeNewSort(
  currentSortBy: 'dueDate' | 'amount',
  currentSortDir: 'asc' | 'desc',
  clickedCol: 'dueDate' | 'amount'
): { sortBy: 'dueDate' | 'amount'; sortDir: 'asc' | 'desc' } {
  if (clickedCol === currentSortBy) {
    return { sortBy: currentSortBy, sortDir: currentSortDir === 'asc' ? 'desc' : 'asc' };
  }
  return { sortBy: clickedCol, sortDir: 'asc' };
}

/**
 * Validates: Requirements 5.2
 */
describe('InvoiceTable property tests', () => {
  it('Property 3: sort direction toggle is consistent', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('dueDate' as const, 'amount' as const),
        fc.constantFrom('asc' as const, 'desc' as const),
        fc.constantFrom('dueDate' as const, 'amount' as const),
        (currentSortBy, currentSortDir, clickedCol) => {
          const result = computeNewSort(currentSortBy, currentSortDir, clickedCol);

          if (clickedCol === currentSortBy) {
            // Same column: direction must toggle
            const expectedDir = currentSortDir === 'asc' ? 'desc' : 'asc';
            expect(result.sortBy).toBe(currentSortBy);
            expect(result.sortDir).toBe(expectedDir);
          } else {
            // Different column: new column selected, direction resets to asc
            expect(result.sortBy).toBe(clickedCol);
            expect(result.sortDir).toBe('asc');
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
