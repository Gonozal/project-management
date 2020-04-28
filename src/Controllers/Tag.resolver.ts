import { Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { EXPECTED_OPTIONS_KEY } from 'dataloader-sequelize';

import { Context } from '../Interfaces/Context';
import { Tag } from '../Models/Tag';
import { Task } from '../Models/Task';

@Resolver(() => Tag)
export default class ProjectResolver {
  @Query(() => [Tag])
  public async tags(@Ctx() ctx: Context) {
    return Tag.findAll({
      [EXPECTED_OPTIONS_KEY]: ctx.context
    });
  }

  @FieldResolver(() => [Task])
  public tasks(@Root() tag: Tag, @Ctx() ctx: Context) {
    return tag.$get('tasks', { [EXPECTED_OPTIONS_KEY]: ctx.context });
  }
}
