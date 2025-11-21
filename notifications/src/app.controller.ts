import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('notifications')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('template/:templateId')
  async getNotificationTemplate(@Param('templateId') templateId: string) {
    return this.appService.fetchTemplate(templateId);
  }
}
