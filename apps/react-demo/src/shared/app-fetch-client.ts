import { Injectable } from '@ns3/di';
import { FetchClient } from '@ns3/fetch-client';
import { fetchClientFactory } from './app-fetch-client-utils';
import { DelayInterceptor } from './delay.interceptor';

@Injectable({ useFactory: fetchClientFactory([DelayInterceptor]) })
export class AppFetchClient extends FetchClient {}
