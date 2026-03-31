export const apiClient = {
  get: (path: string): Promise<Response> =>
    fetch(`${import.meta.env.VITE_API_URL ?? ''}${path}`, {
      headers: { 'Content-Type': 'application/json' },
    }),
};
