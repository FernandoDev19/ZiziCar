import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'ZIZICAR API VERSIÓN 1';
  }
}
