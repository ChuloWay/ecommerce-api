// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { hash } from 'bcryptjs';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema()
export class User extends Document {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the user',
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
    description: 'The role of the user',
  })
  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @ApiProperty({ example: false, description: 'Whether the user is banned' })
  @Prop({ default: false })
  isBanned: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toObject', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

UserSchema.pre<User>('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const hashedPassword = await hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});
