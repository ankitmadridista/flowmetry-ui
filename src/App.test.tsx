import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import App from './App';

vi.mock('./api', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

import { apiClient } from './api';

const mockGet = apiClient.get as ReturnType<typeof vi.fn>;

beforeEach(() => {
  mockGet.mockReset();
});

describe('HealthPage', () => {
  it('shows loading state while request is in-flight', () => {
    mockGet.mockReturnValue(new Promise(() => {})); // never resolves
    render(<App />);
    expect(screen.getByText('Checking connection…')).toBeInTheDocument();
  });

  it('shows "Connected ✓" when API returns ok: true', async () => {
    mockGet.mockResolvedValue({ ok: true });
    render(<App />);
    await waitFor(() => expect(screen.getByText('Connected ✓')).toBeInTheDocument());
  });

  it('shows "Error ✗" when API returns ok: false (non-200)', async () => {
    mockGet.mockResolvedValue({ ok: false });
    render(<App />);
    await waitFor(() => expect(screen.getByText('Error ✗')).toBeInTheDocument());
  });

  it('shows "Error ✗" on network error', async () => {
    mockGet.mockRejectedValue(new Error('Network error'));
    render(<App />);
    await waitFor(() => expect(screen.getByText('Error ✗')).toBeInTheDocument());
  });

  it('displays the API URL', () => {
    mockGet.mockReturnValue(new Promise(() => {})); // never resolves
    render(<App />);
    const expectedUrl = import.meta.env.VITE_API_URL || '(relative)';
    expect(screen.getByText(expectedUrl)).toBeInTheDocument();
  });
});
