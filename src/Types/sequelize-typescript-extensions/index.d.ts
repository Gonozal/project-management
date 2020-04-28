import { BuildOptions } from 'sequelize';
import { Model } from 'sequelize-typescript';

export interface ModelInterface {
  new (values?: object, options?: BuildOptions): Model;
  tableName: string;
  findAll(): Promise<Model[]>;
  findOne(): Promise<Model | undefined>;
}
