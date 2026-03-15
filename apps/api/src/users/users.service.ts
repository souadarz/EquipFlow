import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async create(dto: CreateUserDto): Promise<UserDocument> {
    const hash = await bcrypt.hash(dto.password, 10);
    return this.userModel.create({ ...dto, password: hash });
  }

  async findOne(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password');
  }

  async findById(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId);
  }
}
