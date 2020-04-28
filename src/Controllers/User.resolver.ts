import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from 'type-graphql';
import { createContext, EXPECTED_OPTIONS_KEY } from 'dataloader-sequelize';

import { User } from '../Models/User';
import Token from '../Classes/Token';
import { Context } from '../Interfaces/Context';
import { Task } from '../Models/Task';

@Resolver(() => User)
export default class UserResolver {
  @Authorized()
  @Query(() => User)
  public async self(@Ctx() ctx: Context) {
    if (!ctx.user) {
      throw new Error('User attribute missing in JWT');
    }

    const user = await User.findOne({
      where: { id: ctx.user.id },
      [EXPECTED_OPTIONS_KEY]: ctx.context
    });

    if (!user) {
      throw new Error('User-ID not found');
    }
    return user;
  }

  @FieldResolver(() => [Task])
  tasks(@Root() user: User, @Ctx() ctx: Context) {
    return user.$get('tasks', { [EXPECTED_OPTIONS_KEY]: ctx.context });
  }

  @FieldResolver(() => [Task])
  projects(@Root() user: User, @Ctx() ctx: Context) {
    return user.$get('projects', { [EXPECTED_OPTIONS_KEY]: ctx.context });
  }

  @Mutation(() => Token)
  public async userSignIn(
    @Arg('name') name: string,
    @Arg('password') password: string,
    @Ctx() ctx: Context
  ) {
    // Check if the user is valid
    const user = await User.findOne({
      where: { name },
      [EXPECTED_OPTIONS_KEY]: ctx.context
    });

    if (!user) {
      throw new Error('No user with that email');
    }

    const valid = await user.verifyPassword(password);
    if (!valid) {
      throw new Error('Incorrect password');
    }
    const token = await user.jwt();
    ctx.res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    return { token };
  }

  @Mutation(() => Token)
  public userSignOut(@Ctx() ctx: Context): Token {
    // Check if the user is valid
    ctx.res.clearCookie('token');
    return { token: '' };
  }
}
