import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  HttpStatus,
  Res,
} from '@nestjs/common';
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
import { Response } from 'express';

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
  async getAllUsers(@Res() res: Response) {
    const users = await this.userService.getAllUsers();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: users,
      message: 'Successfully retrieved all users',
    });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a single user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return a single user',
    type: UserResponseDto,
  })
  async getUserById(@Param('id') userId: string, @Res() res: Response) {
    const user = await this.userService.getUserById(userId);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: user,
      message: 'Successfully retrieved user',
    });
  }

  @Patch(':id/ban')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Ban a user' })
  @ApiResponse({
    status: 200,
    description: 'User banned successfully',
    type: UserResponseDto,
  })
  async banUser(@Param('id') userId: string, @Res() res: Response) {
    const bannedUser = await this.userService.banUser(userId);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: bannedUser,
      message: 'User banned successfully',
    });
  }

  @Patch(':id/unban')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Unban a user' })
  @ApiResponse({
    status: 200,
    description: 'User unbanned successfully',
    type: UserResponseDto,
  })
  async unbanUser(@Param('id') userId: string, @Res() res: Response) {
    const unbannedUser = await this.userService.unbanUser(userId);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: unbannedUser,
      message: 'User unbanned successfully',
    });
  }
}
