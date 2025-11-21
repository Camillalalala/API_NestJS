import { Injectable, NotFoundException } from '@nestjs/common';
import {
  EMAIL_TEMPLATES,
  type EmailTemplate,
} from './stubs/email-templates.stub';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getEmailTemplate(key: string): EmailTemplate {
    const tpl = EMAIL_TEMPLATES[key];
    if (!tpl) {
      throw new NotFoundException(`Email template not found: ${key}`);
    }
    return tpl;
  }
}
