import { Field, ID, ObjectType } from 'type-graphql';
import {
  BeforeCreate,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { Task } from './Task';
import { User } from './User';

@ObjectType()
@Table({
  indexes: [
    {
      unique: true,
      fields: ['key']
    }
  ]
})
export class Project extends Model<Project> {
  @PrimaryKey
  @Field(() => ID)
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  public id!: string;

  @Field()
  @Column
  public name!: string;

  @Field()
  @Column
  public key!: string;

  @Field(() => [Task])
  @HasMany(() => Task)
  public tasks!: Task[];

  @Field({ nullable: true })
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  public leadId?: string;

  @Field(() => User, { nullable: true })
  @BelongsTo(() => User, { foreignKey: 'assignedToId' })
  public lead?: User;

  @Field()
  @CreatedAt
  @Column
  public createdAt!: Date;

  @Field()
  @UpdatedAt
  @Column
  public updatedAt!: Date;

  @BeforeCreate
  static createKeyIfNotExist(project: Project) {
    if (!project.key) {
      project.key = project.defaultKey;
    }
  }

  private get defaultKey() {
    return this.name
      .split(/[ \-_]/)
      .map(str => str[0])
      .join('')
      .toUpperCase();
  }
}
