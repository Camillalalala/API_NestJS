import { Controller, Get, Param, Put } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('events')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Returns a pre-made email template stub by template id
  @Get('template-data/:templateId')
  getEmailTemplate(@Param('templateId') templateId: string) {
    return this.appService.getEmailTemplate(templateId);
  }

  @Put('/notifyEventUpdate')
  async callEventDetailsNotif(@Param('eventId') eventId: string) {
    return this.appService.callEventDetailsNotif(eventId);
  }
}
