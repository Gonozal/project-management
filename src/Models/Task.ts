import { Field, ObjectType } from 'type-graphql';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { Project } from './Project';
import { User } from './User';
import { Tag } from './Tag';
import { TaggedTask } from './TaggedTask';

@ObjectType()
@Table({
  indexes: [
    {
      unique: false,
      fields: ['sequence']
    },
    {
      unique: true,
      fields: ['projectId', 'sequence']
    }
  ]
})
export class Task extends Model<Task> {
  @PrimaryKey
  @Field()
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  public id!: string;

  @Field()
  @Column({ allowNull: false })
  public sequence!: number;

  @Field()
  @Column({ allowNull: false })
  public name!: string;

  @Field({ nullable: true })
  @Column({ type: DataType.TEXT })
  public description?: string;

  @Field()
  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false })
  public projectId!: string;

  @Field(() => Project)
  @BelongsTo(() => Project)
  public project!: Project;

  @Field({ nullable: true })
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  public assignedToId?: string;

  @Field(() => User, { nullable: true })
  @BelongsTo(() => User, { foreignKey: 'assignedToId' })
  public assignedTo?: User;

  @BelongsToMany(
    () => Tag,
    () => TaggedTask
  )
  public tags!: (Tag & { taggedTask: TaggedTask })[];

  @Field()
  @CreatedAt
  @Column
  public createdAt!: Date;

  @Field()
  @UpdatedAt
  @Column
  public updatedAt!: Date;

  // @Field(() => String)
  // @Column({ type: DataType.VIRTUAL })
  // private get key(): string {
  //   if (!this.sequence)
  //     throw new TypeError('"Project" not loaded for "Task" Model');
  //   return `${this.project.key}-${this.sequence}`;
  // }

  public static async nextSequence(projectId: string): Promise<number> {
    const max: number | null = await this.unscoped().max('sequence', {
      where: { projectId }
    });
    return (max || 0) + 1;
  }
}
