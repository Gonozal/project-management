import { IsBoolean } from 'class-validator';
import { InputType, Field } from 'type-graphql';

@InputType()
export class UpdateRegisterInput {
  @Field()
  public id!: string;

  @IsBoolean()
  @Field()
  public open!: boolean;
}
