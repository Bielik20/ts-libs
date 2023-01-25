import { Injectable } from '@ns3/di';
import { RequestHandler } from '@ns3/fetch-client';
import { RequestClassInterceptor } from './app-fetch-client-utils';

@Injectable()
export class DelayInterceptor implements RequestClassInterceptor {
  private readonly delay = 300;

  async intercept(req: Request, next: RequestHandler): Promise<Response> {
    await new Promise((res) => setTimeout(res, this.delay));

    return next(req);
  }
}
