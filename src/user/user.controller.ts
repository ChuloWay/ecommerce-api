import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from './models/user.model';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users',
    type: [UserResponseDto],
  })
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Patch(':id/ban')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Ban a user' })
  @ApiResponse({
    status: 200,
    description: 'User banned successfully',
    type: UserResponseDto,
  })
  banUser(@Param('id') userId: string) {
    return this.userService.banUser(userId);
  }

  @Patch(':id/unban')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Unban a user' })
  @ApiResponse({
    status: 200,
    description: 'User unbanned successfully',
    type: UserResponseDto,
  })
  unbanUser(@Param('id') userId: string) {
    return this.userService.unbanUser(userId);
  }
}
