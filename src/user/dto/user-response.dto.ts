import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../models/user.model';

export class UserResponseDto {
  @ApiProperty({
    example: '5f9d7a3b9d3f2c1b4c9e6b7a',
    description: 'The id of the user',
  })
  readonly _id: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  readonly name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the user',
  })
  readonly email: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
    description: 'The role of the user',
  })
  readonly role: UserRole;

  @ApiProperty({ example: false, description: 'Whether the user is banned' })
  readonly isBanned: boolean;
}
