import { CanActivate, ExecutionContext } from '@nestjs/common';

export class LocalAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.session?.user;
  }
}

export class SuperUserAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return false;
  }
}
