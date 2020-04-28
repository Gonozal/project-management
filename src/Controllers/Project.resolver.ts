import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from 'type-graphql';
import { EXPECTED_OPTIONS_KEY } from 'dataloader-sequelize';

import { Project } from '../Models/Project';
import { Context } from '../Interfaces/Context';
import {
  CreateProjectInput,
  GetDefaultKeyInput
} from '../InputTypes/Project.input';
import { Task } from '../Models/Task';

@Resolver(() => Project)
export default class ProjectResolver {
  @Query(() => [Project])
  public async projects(@Ctx() ctx: Context) {
    return Project.findAll({
      [EXPECTED_OPTIONS_KEY]: ctx.context
    });
  }

  @Query(() => String)
  public async defaultProjectKey(
    @Arg('getDefaultKeyInput') getDefaultKeyData: GetDefaultKeyInput,
    @Ctx() ctx: Context
  ) {
    const project = new Project(getDefaultKeyData);
    Project.createKeyIfNotExist(project);
    return project.key;
  }

  @FieldResolver(() => [Task])
  public tasks(@Root() project: Project, @Ctx() ctx: Context) {
    return project.$get('tasks', { [EXPECTED_OPTIONS_KEY]: ctx.context });
  }

  @FieldResolver(() => Number)
  public taskCount(
    @Root() project: Project,
    @Ctx() ctx: Context
  ): Promise<number> {
    return project.$count('tasks', { [EXPECTED_OPTIONS_KEY]: ctx.context });
  }

  @Mutation(() => Project)
  public async createProject(
    @Arg('createProjectInput') createProjectData: CreateProjectInput,
    @Ctx() ctx: Context
  ) {
    return Project.create(createProjectData);
  }
}
