import { AuthGuard } from '@nestjs/passport';

export class RtGuard extends AuthGuard('jwt-refresh-token') {
  constructor() {
    super();
  }
}
