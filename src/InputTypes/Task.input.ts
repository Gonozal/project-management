import { InputType, Field } from 'type-graphql';
import { MatchesForeignAttribute } from '../Validators/MatchesForeignAttribute';
import { Project } from '../Models/Project';

@InputType()
export class CreateTaskInput {
  @Field()
  public name!: string;

  @Field({ nullable: true })
  public description?: string;

  @MatchesForeignAttribute({ model: Project, foreignAttribute: 'key' })
  @Field()
  public projectKey!: string;
}
