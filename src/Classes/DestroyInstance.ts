import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class DestroyInstance {
  @Field()
  public rows!: number;
}
