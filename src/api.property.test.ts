import { describe, it, vi, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { apiClient } from './api';

/**
 * Validates: Requirements 8.5
 * Feature: flowmetry-phase1-foundation, Property 1: API client always sends Content-Type header
 */
describe('apiClient property tests', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('Feature: flowmetry-phase1-foundation, Property 1: API client always sends Content-Type header', async () => {
    await fc.assert(
      fc.asyncProperty(fc.string(), async (path) => {
        let capturedContentType: string | null = null;

        vi.stubGlobal(
          'fetch',
          vi.fn((_url: string, init?: RequestInit) => {
            const headers = init?.headers as Record<string, string> | undefined;
            capturedContentType = headers?.['Content-Type'] ?? null;
            return Promise.resolve(new Response(null, { status: 200 }));
          }),
        );

        await apiClient.get(path);

        return capturedContentType === 'application/json';
      }),
      { numRuns: 100 },
    );
  });
});
