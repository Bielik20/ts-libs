import { Injectable } from '@ns3/di';
import { FetchClient } from '@ns3/http-client';
import { fetchClientFactory } from './app-fetch-client-utils';
import { DelayInterceptor } from './delay.interceptor';

@Injectable({ factory: fetchClientFactory([DelayInterceptor]) })
export class AppFetchClient extends FetchClient {}
