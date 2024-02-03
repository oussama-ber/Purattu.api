/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsEmail, IsString, MinLength  } from 'class-validator';
import { UserRole } from 'src/auth/schemas/user.schema';

export class CreateUserDTO {
    @IsNotEmpty()
    @IsString()
    username: string;
    @IsNotEmpty()
    @IsEmail({}, {message: 'Please enter valid email'})
    email: string;

    @IsNotEmpty()
    role: UserRole;
}
export class SignUpDto {
    @IsNotEmpty()
    @IsString()
    username: string;
    @IsNotEmpty()
    @IsEmail({}, {message: 'Please enter valid email'})
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    confirmPassword: string;
}
export class LoginDto {
    @IsNotEmpty()
    @IsEmail({}, {message: 'Please enter valid email'})
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}