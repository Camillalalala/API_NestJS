import {
  Injectable,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import axios from 'axios';

interface RegisterPayload {
  name: string;
  email?: string; // optional stub for future
  password?: string; // optional stub; not stored here
}

interface CreatedUser {
  id: number;
  name: string;
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  private readonly usersServiceBase = 'http://localhost:3005';

  async register(payload: RegisterPayload): Promise<{ user: CreatedUser }> {
    if (!payload.name || payload.name.trim().length === 0) {
      throw new BadRequestException('Name is required');
    }
    // Simulate auth account creation (hash password etc.) omitted for brevity
    try {
      const response = await axios.post<CreatedUser>(
        `${this.usersServiceBase}/users`,
        { name: payload.name.trim() },
      );
      return { user: response.data };
    } catch (err: any) {
      if (err?.response?.status === 409) {
        throw new BadRequestException('User already exists');
      }
      throw new ServiceUnavailableException('Failed to create user profile');
    }
  }
}
