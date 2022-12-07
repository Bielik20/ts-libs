import { Injectable } from '@ns3/di';
import { FetchHandler } from '@ns3/http-client';
import { FetchClassInterceptor } from './app-fetch-client-utils';

@Injectable()
export class DelayInterceptor implements FetchClassInterceptor {
  private readonly delay = 300;

  async intercept(req: Request, next: FetchHandler): Promise<Response> {
    await new Promise((res) => setTimeout(res, this.delay));

    return next(req);
  }
}
