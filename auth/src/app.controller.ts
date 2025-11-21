import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('auth/register')
  async register(
    @Body() body: { name: string; email?: string; password?: string },
  ): Promise<{ user: { id: number; name: string } }> {
    return this.appService.register(body);
  }
}
