import { Request, Response } from 'express';
import { Context as DataLoaderContext } from 'dataloader-sequelize';
export interface JWTPayload {
  id: string;
}

export interface Context {
  req: Request;
  res: Response;
  user?: JWTPayload;
  context: DataLoaderContext;
}
