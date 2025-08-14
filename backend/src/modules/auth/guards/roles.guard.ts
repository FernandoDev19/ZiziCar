import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEYS } from '../decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector){}

  canActivate(
    context: ExecutionContext,
  ): boolean {

    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEYS, [
      context.getHandler(),
      context.getClass()
    ]);

    if(!roles){
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if(user.role === 'admin'){
      return true;
    }

    return roles.includes(user.role);
  }
}
