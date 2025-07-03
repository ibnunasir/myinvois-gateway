export function resolveCredentials(headers: Headers, fallback: {clientId: string; clientSecret: string}) {
  const headerClientId = headers.get('x-client-id');
  const headerClientSecret = headers.get('x-client-secret');
  if ((headerClientId && !headerClientSecret) || (!headerClientId && headerClientSecret)) {
    throw new Error('Both X-CLIENT-ID and X-CLIENT-SECRET must be provided together');
  }
  return {
    clientId: headerClientId ?? fallback.clientId,
    clientSecret: headerClientSecret ?? fallback.clientSecret,
  };
}
