import { MyInvoisClient } from 'myinvois-client';
import { CONFIG } from '../config';
import { redisInstance } from '../redis';
import { resolveCredentials } from './credentials';

export function createClient(headers: Headers): MyInvoisClient {
  const creds = resolveCredentials(headers, { clientId: CONFIG.clientId, clientSecret: CONFIG.clientSecret });
  return new MyInvoisClient(creds.clientId, creds.clientSecret, CONFIG.env, redisInstance);
}
