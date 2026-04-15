/**
 * Decodes the payload of a JWT without verifying the signature.
 * Safe for client-side expiry checks — the server still validates the signature.
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // exp is in seconds, Date.now() is in milliseconds
    return typeof payload.exp === 'number' && payload.exp * 1000 < Date.now();
  } catch {
    // Malformed token — treat as expired
    return true;
  }
}
