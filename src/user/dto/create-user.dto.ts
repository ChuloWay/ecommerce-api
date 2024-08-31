import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  Matches,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  @Matches(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, {
    message: 'Invalid email format',
  })
  @Transform((params) => params.value.toLowerCase())
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(6)
  readonly password: string;
}
