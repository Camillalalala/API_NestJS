import { Injectable, NotFoundException } from '@nestjs/common';
import {
  EMAIL_TEMPLATES,
  type EmailTemplate,
} from './stubs/email-templates.stub';
import axios from 'axios';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  private readonly notificationsBaseUrl = 'http://localhost:3004';

  getEmailTemplate(key: string): EmailTemplate {
    const tpl = EMAIL_TEMPLATES[key];
    if (!tpl) {
      throw new NotFoundException(`Email template not found: ${key}`);
    }
    return tpl;
  }

  async callEventDetailsNotif(eventId: string): Promise<{ message: string }> {
    const url = `${this.notificationsBaseUrl}/notifications/event-update`;
    const { data } = await axios.post(url);
    return {
      message: `Notifies when ${eventId} details has been modified: ${data}`,
    };
  }
}
