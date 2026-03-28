import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Role } from '@repo/shared';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class AdminSeeder {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) { }

  async run() {
    const existingAdmin = await this.userModel.findOne({ role: Role.ADMIN });
    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('password', 10);

    const admin = new this.userModel({
      fullname: 'Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: Role.ADMIN,
    });

    await admin.save();
    console.log('admin seeded successfully');
  }
}
