import { AfterFind, Column, DataType, Model } from 'sequelize-typescript';
import { QueryOptions } from 'sequelize';
import { Context, EXPECTED_OPTIONS_KEY } from 'dataloader-sequelize';

export class BaseModel extends Model {
  @Column({ type: DataType.VIRTUAL })
  public context?: Context;

  @AfterFind
  private static injectDataloader<T extends BaseModel>(
    instanceOrArray: T | T[],
    options: QueryOptions
  ) {
    let instances: T[];
    if (instanceOrArray instanceof Array) {
      instances = instanceOrArray;
    } else {
      instances = [instanceOrArray];
    }
    if (EXPECTED_OPTIONS_KEY in options) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore - we checked this key in the if statement
      const context: Context = options[EXPECTED_OPTIONS_KEY];
      instances.forEach(instance => (instance.context = context));
    }
  }
}
