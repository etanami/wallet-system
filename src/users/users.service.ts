import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/user.entity';
import { CreateUserDto } from 'src/dtos/createUser.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  // Injects User repository for database operations
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // Creates new user from DTO and saves to database
  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  // Retrieves all users from database
  public async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
