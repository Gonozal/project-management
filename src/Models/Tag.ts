import { Field, ID, ObjectType } from 'type-graphql';
import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { Task } from './Task';
import { TaggedTask } from './TaggedTask';

@ObjectType()
@Table
export class Tag extends Model<Tag> {
  @PrimaryKey
  @Field(() => ID)
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  public id!: string;

  @Field()
  @Column({ allowNull: false })
  public name!: string;

  @Field({ nullable: true })
  @Column
  public description?: string;

  @Field({ nullable: true, defaultValue: '#232323' })
  @Column
  public color!: string;

  @BelongsToMany(
    () => Task,
    () => TaggedTask
  )
  public tasks!: (Task & { taggedTask: TaggedTask })[];

  @Field()
  @CreatedAt
  @Column
  public createdAt!: Date;

  @Field()
  @UpdatedAt
  @Column
  public updatedAt!: Date;
}
