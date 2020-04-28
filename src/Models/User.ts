import {
  Model,
  DataType,
  Column,
  Table,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  Default,
  NotNull,
  HasMany,
  BeforeCreate
} from 'sequelize-typescript';
import { Field, ID, ObjectType } from 'type-graphql';
import jsonWebToken from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { JWTPayload } from '../Interfaces/Context';
import { Project } from './Project';
import { Task } from './Task';

@ObjectType()
@Table({
  indexes: [
    {
      unique: true,
      fields: ['name']
    }
  ]
})
export class User extends Model<User> {
  @Field(() => ID)
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  public id!: string;

  @Field()
  @Column({ allowNull: false })
  public name!: string;

  @Column({ type: DataType.VIRTUAL })
  public password?: string;

  @Column
  public securePassword!: string;

  @Field(() => [Project])
  @HasMany(() => Project)
  public projects!: Project[];

  @Field(() => [Task])
  @HasMany(() => Task)
  public tasks!: Task[];

  @Field()
  @CreatedAt
  @Column
  public createdAt!: Date;

  @Field()
  @UpdatedAt
  @Column
  public updatedAt!: Date;

  @BeforeCreate
  public static hashPassword(instance: User) {
    return instance.hashPassword();
  }

  private async hashPassword(): Promise<void> {
    if (!this.password) {
      throw new ReferenceError(
        'user.password needs to be set when calling User.hashPassword'
      );
    }
    const salt = await bcrypt.genSalt(12);
    this.securePassword = await bcrypt.hash(this.password, salt);
    this.password = undefined;
  }

  public async verifyPassword(password?: string) {
    return bcrypt.compare(password, this.securePassword);
  }

  public async jwt() {
    const expiresIn = '10y';
    const payload: JWTPayload = {
      id: this.id.toString()
    };
    return jsonWebToken.sign(payload, process.env.CRYPTO_KEY as string, {
      expiresIn
    });
  }
}
