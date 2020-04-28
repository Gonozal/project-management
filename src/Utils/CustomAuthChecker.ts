import { AuthChecker } from 'type-graphql';
import { Context } from '../Interfaces/Context';

export const customAuthChecker: AuthChecker<Context> = ({ context }) => {
  const { user } = context;
  return user !== undefined;
};
