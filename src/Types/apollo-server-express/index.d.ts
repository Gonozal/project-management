import { ExecutionParams } from 'subscriptions-transport-ws';

declare module 'apollo-server-express' {
  export interface ExpressContext {
    req: express.Request & { user: object };
    res: express.Response;
    connection?: ExecutionParams;
  }
}
