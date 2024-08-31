import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './models/user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUserById(userId: string): Promise<User> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException(`Invalid user ID format: ${userId}`);
    }
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user.toObject();
  }

  async banUser(userId: string): Promise<User> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException(`Invalid user ID format: ${userId}`);
    }
    return this.userModel.findByIdAndUpdate(
      userId,
      { isBanned: true },
      { new: true },
    );
  }

  async unbanUser(userId: string): Promise<User> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException(`Invalid user ID format: ${userId}`);
    }
    return this.userModel.findByIdAndUpdate(
      userId,
      { isBanned: false },
      { new: true },
    );
  }
}
