/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Post,
  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO, LoginDto, SignUpDto } from './inputAuth.dto';
  
  @Controller('auth')
  export class AuthController {
    constructor(private _authService: AuthService) {}
    @Post()
    async CreatTask(@Body() createUserDTO: CreateUserDTO): Promise<string> {
      return this._authService.createUser(createUserDTO);
    }
    @Post('/signup')
    async signUp(@Body() signUpDto: SignUpDto): Promise<{token: string, userCreated: boolean}> {
      return this._authService.signUp(signUpDto);
    }
    @Post('/login')
    async login(@Body() loginDto: LoginDto): Promise<{token: string}> {
      return this._authService.login(loginDto);
    }
  }
  