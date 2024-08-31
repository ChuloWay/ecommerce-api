import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/user/models/user.model';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
