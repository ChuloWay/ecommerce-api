import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async banUser(userId: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { isBanned: true },
      { new: true },
    );
  }

  async unbanUser(userId: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { isBanned: false },
      { new: true },
    );
  }
}
