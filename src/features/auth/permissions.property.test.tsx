/// <reference types="@testing-library/jest-dom" />
import { cleanup, render, screen } from '@testing-library/react';
import { describe, it, vi, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { useObjectEnabled, usePermission } from './usePermissions';
import { PERMISSION_MAP } from './permissions';

// ---------------------------------------------------------------------------
// Mock PermissionContext — mutable object controls what hooks read
// ---------------------------------------------------------------------------
const mockContextValue = {
  securityObjectStatus: {} as Record<number, boolean>,
  permissions: [] as number[],
  loading: false,
  error: null,
};

vi.mock('./PermissionContext', () => ({
  usePermissionContext: () => mockContextValue,
}));

// ---------------------------------------------------------------------------
// Helper components for hook tests
// ---------------------------------------------------------------------------
function UsePermissionHelper({ objId, operationId }: { objId: number; operationId: number }) {
  const result = usePermission(objId, operationId);
  return <div data-testid="result">{String(result)}</div>;
}

function UseObjectEnabledHelper({ objId }: { objId: number }) {
  const result = useObjectEnabled(objId);
  return <div data-testid="result">{String(result)}</div>;
}

afterEach(() => {
  cleanup();
});

// ---------------------------------------------------------------------------
// Property 8: usePermission correctness
// Feature: rbac-permissions, Property 8: usePermission correctness
// Validates: Requirements 6.2, 6.3, 6.4
// ---------------------------------------------------------------------------
describe('Property 8: usePermission correctness', () => {
  it('Feature: rbac-permissions, Property 8: usePermission correctness', () => {
    // Arbitrary objId and operationId in range 1-6
    const objIdArb = fc.integer({ min: 1, max: 6 });
    const operationIdArb = fc.integer({ min: 1, max: 6 });

    // Arbitrary securityObjectStatus: Record<number, boolean> for keys 1-6
    const statusArb = fc.record({
      1: fc.boolean(),
      2: fc.boolean(),
      3: fc.boolean(),
      4: fc.boolean(),
      5: fc.boolean(),
      6: fc.boolean(),
    }).map((r) => r as Record<number, boolean>);

    // Arbitrary permissions: subset of permission IDs 1-20
    const permissionsArb = fc.array(fc.integer({ min: 1, max: 20 }), { minLength: 0, maxLength: 20 })
      .map((arr) => [...new Set(arr)]);

    fc.assert(
      fc.property(statusArb, permissionsArb, objIdArb, operationIdArb, (securityObjectStatus, permissions, objId, operationId) => {
        // Set mock context
        mockContextValue.securityObjectStatus = securityObjectStatus;
        mockContextValue.permissions = permissions;

        // Render helper component
        render(<UsePermissionHelper objId={objId} operationId={operationId} />);
        const result = screen.getByTestId('result').textContent === 'true';

        // Cleanup before next iteration
        cleanup();

        // Compute expected value
        const objectEnabled = securityObjectStatus[objId] === true;

        const permissionId = Object.keys(PERMISSION_MAP).find(
          (id) =>
            PERMISSION_MAP[Number(id)].objId === objId &&
            PERMISSION_MAP[Number(id)].operationId === operationId,
        );

        const expected =
          objectEnabled &&
          permissionId !== undefined &&
          permissions.includes(Number(permissionId));

        return result === expected;
      }),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 9: useObjectEnabled correctness
// Feature: rbac-permissions, Property 9: useObjectEnabled correctness
// Validates: Requirements 7.2, 7.3
// ---------------------------------------------------------------------------
describe('Property 9: useObjectEnabled correctness', () => {
  it('Feature: rbac-permissions, Property 9: useObjectEnabled correctness', () => {
    // Arbitrary securityObjectStatus: Record<number, boolean> for keys 1-6
    const statusArb = fc.record({
      1: fc.boolean(),
      2: fc.boolean(),
      3: fc.boolean(),
      4: fc.boolean(),
      5: fc.boolean(),
      6: fc.boolean(),
    }).map((r) => r as Record<number, boolean>);

    const objIdArb = fc.integer({ min: 1, max: 6 });

    fc.assert(
      fc.property(statusArb, objIdArb, (securityObjectStatus, objId) => {
        // Set mock context
        mockContextValue.securityObjectStatus = securityObjectStatus;
        mockContextValue.permissions = [];

        // Render helper component
        render(<UseObjectEnabledHelper objId={objId} />);
        const result = screen.getByTestId('result').textContent === 'true';

        // Cleanup before next iteration
        cleanup();

        // Expected: securityObjectStatus[objId] ?? false
        const expected = securityObjectStatus[objId] ?? false;

        return result === expected;
      }),
      { numRuns: 100 },
    );
  });
});
