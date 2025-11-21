import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
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

  @Get('auth/permissions/check/:userId')
  async checkPermissions(
    @Param('userId') userId: string,
    @Query('clubId') clubId: string,
  ): Promise<{ clubId: number; userId: number; role: string }> {
    const numericUserId = Number(userId);
    const numericClubId = Number(clubId);
    const result: { clubId: number; userId: number; role: string } =
      await this.appService.checkPermissions(numericUserId, numericClubId);
    return { clubId: result.clubId, userId: result.userId, role: result.role };
  }
}
