declare module 'dataloader-sequelize' {
  import { Model } from 'sequelize-typescript';
  import { Sequelize } from 'sequelize';

  interface Options {
    max?: number;
  }
  export interface Context {
    loaders: {
      [key: string]: any;
    };
    prime: (queryResults: Model | Model[]) => void;
  }

  export const createContext: (
    sequelize: Sequelize,
    options?: Options
  ) => Context;
  export const EXPECTED_OPTIONS_KEY: string;
}
