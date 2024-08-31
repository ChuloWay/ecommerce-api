import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: AuthResponseDto,
  })
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.authService.register(
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
    );
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: user,
      message: 'User successfully registered',
    });
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: AuthResponseDto,
  })
  async login(@Body() loginDto: LoginUserDto, @Res() res: Response) {
    const authData = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: authData,
      message: 'User successfully logged in',
    });
  }
}
