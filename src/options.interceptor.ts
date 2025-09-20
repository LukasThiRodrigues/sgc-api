import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Injectable()
export class OptionsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    if (request.method === 'OPTIONS') {
      const response = context.switchToHttp().getResponse();
      response.status(204).end();
      return of(null);
    }
    
    return next.handle();
  }
}