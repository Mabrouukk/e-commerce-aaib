//Services, also known as Providers, contain the core business logic. They are responsible for data retrieval and manipulation
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
