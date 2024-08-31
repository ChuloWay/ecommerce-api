import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'The access token for the authenticated user',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  accessToken: string;

  @ApiProperty({
    description: 'The user details of the authenticated user',
    example: {
      id: '605c72ef1f1d6e001f6b8f6e',
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
  })
  user: {
    id: string;
    name: string;
    email: string;
  };
}
