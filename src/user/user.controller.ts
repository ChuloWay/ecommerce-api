import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from './models/user.model';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Patch(':id/ban')
  @Roles(UserRole.ADMIN)
  banUser(@Param('id') userId: string) {
    return this.userService.banUser(userId);
  }

  @Patch(':id/unban')
  @Roles(UserRole.ADMIN)
  unbanUser(@Param('id') userId: string) {
    return this.userService.unbanUser(userId);
  }
}
