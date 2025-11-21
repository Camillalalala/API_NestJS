import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';

type EmailTemplate = {
  key: string;
  subject: string;
  html: string;
  text: string;
  variables: string[];
};

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  private readonly eventsBaseUrl = 'http://localhost:3002';

  async fetchTemplate(templateId: string): Promise<EmailTemplate> {
    const url = `${this.eventsBaseUrl}/events/template-data/${templateId}`;
    const { data } = await axios.get<EmailTemplate>(url);
    if (!data) {
      throw new NotFoundException(
        `Template ${templateId} not found in Events service.`,
      );
    }
    return data;
  }
}
