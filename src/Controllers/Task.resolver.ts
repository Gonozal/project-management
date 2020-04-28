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

import { Task } from '../Models/Task';
import { Context } from '../Interfaces/Context';
import { CreateTaskInput } from '../InputTypes/Task.input';
import { Project } from '../Models/Project';
import { Tag } from '../Models/Tag';
import { User } from '../Models/User';

@Resolver(() => Task)
export default class TaskResolver {
  @Query(() => [Task])
  public async tasks(@Ctx() ctx: Context) {
    return Task.findAll({
      [EXPECTED_OPTIONS_KEY]: ctx.context
    });
  }

  @FieldResolver(() => Project)
  project(@Root() task: Task, @Ctx() ctx: Context) {
    return task.$get('project', { [EXPECTED_OPTIONS_KEY]: ctx.context });
  }

  @FieldResolver(() => [Tag])
  tags(@Root() task: Task, @Ctx() ctx: Context) {
    return task.$get('tags', { [EXPECTED_OPTIONS_KEY]: ctx.context });
  }

  @FieldResolver(() => User)
  assignedTo(@Root() task: Task, @Ctx() ctx: Context) {
    return task.$get('assignedTo', { [EXPECTED_OPTIONS_KEY]: ctx.context });
  }

  @FieldResolver(() => String)
  async key(@Root() task: Task, @Ctx() ctx: Context): Promise<string> {
    const project = (await task.$get('project', {
      [EXPECTED_OPTIONS_KEY]: ctx.context
    })) as Project;
    return `${project.key}-${task.sequence}`;
  }

  @Mutation(() => Task)
  public async createTask(
    @Arg('createTaskInput') createTaskData: CreateTaskInput,
    @Ctx() ctx: Context
  ) {
    // presence validated in CreateTaskInput
    const project = (await Project.findOne({
      where: { key: createTaskData.projectKey },
      [EXPECTED_OPTIONS_KEY]: ctx.context
    })) as Project;
    const task = new Task(createTaskData);
    task.projectId = project.id;
    task.project = project;
    task.sequence = await Task.nextSequence(project.id);
    return task.save();
  }
}
