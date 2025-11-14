// gateway/src/app.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { User, Club } from './types';

@Injectable()
export class AppService {
  async getUsers(): Promise<User[]> {
    const res = await axios.get<User[]>('http://localhost:3005/users');
    return res.data;
  }

  async getClubs(): Promise<Club[]> {
    const res = await axios.get<Club[]>('http://localhost:3001/clubs');
    return res.data;
  }
}
