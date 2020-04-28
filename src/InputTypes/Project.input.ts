import { Length } from 'class-validator';
import { InputType, Field } from 'type-graphql';
import { IsUniqueAttribute } from '../Validators/IsUniqueAttribute';
import { Project } from '../Models/Project';

@InputType()
export class CreateProjectInput {
  @Field()
  public name!: string;

  @Length(2, 5)
  @IsUniqueAttribute(Project)
  @Field({ nullable: true })
  public key?: string;
}

@InputType()
export class GetDefaultKeyInput {
  @Field()
  public name!: string;
}
