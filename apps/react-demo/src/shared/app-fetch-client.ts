import { Injectable } from '@ns3/di';
import { FetchClient } from '@ns3/http-client';
import { fetchClientProvider } from './app-fetch-client-utils';
import { DelayInterceptor } from './delay.interceptor';

@Injectable({ provider: fetchClientProvider([DelayInterceptor]) })
export class AppFetchClient extends FetchClient {}
