import { Injectable, NestMiddleware } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { user } = req.session || {};
    if (user && user._id) {
      const currentUser = await this.usersService.findOne(user._id);
      req.user = currentUser;
    }
    next();
  }
}
