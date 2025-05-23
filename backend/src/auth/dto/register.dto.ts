import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'testuser', description: 'Username of the user' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'test@example.com',
    description: 'Email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'testpass', description: 'Password of the user' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
