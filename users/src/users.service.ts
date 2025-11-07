import { Injectable, NotFoundException } from '@nestjs/common';
import { User, createUser } from '../entity/app.entity';

@Injectable()
export class UsersService {
  //Using in-memory array to simulate database but irl, actual DB is used and async would be necessary
  private users: User[] = [
    { id: 1, name: 'Camilla' },
    { id: 2, name: 'Khang' },
  ];
  async getUsers(): Promise<User[]> {
    return await Promise.resolve(this.users);
  }

  async findOne(name: string): Promise<User> {
    const user = this.users.find((u) => u.name === name);
    if (!user) {
      throw new NotFoundException(`User with name "${name}" does not exist`);
    }
    return await Promise.resolve(user);
  }

  async create(createUser: createUser): Promise<User> {
    const newUser = { ...createUser, id: this.users.length + 1 };
    this.users.push(newUser);
    return await Promise.resolve(newUser);
  }
}
