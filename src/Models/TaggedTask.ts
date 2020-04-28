import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript';
import { Tag } from './Tag';
import { Task } from './Task';

@ObjectType()
@Table({
  indexes: [
    {
      unique: true,
      fields: ['tagId', 'taskId']
    }
  ]
})
export class TaggedTask extends Model<TaggedTask> {
  @Field()
  @ForeignKey(() => Tag)
  @Column({ type: DataType.UUID })
  tagId!: string;

  @Field()
  @ForeignKey(() => Task)
  @Column({ type: DataType.UUID })
  taskId!: string;
}
