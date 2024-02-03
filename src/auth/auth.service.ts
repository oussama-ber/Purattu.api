/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDTO, LoginDto, SignUpDto } from './inputAuth.dto';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
export interface IAuthService {
  createUser(createUserDTO: CreateUserDTO): Promise<string>;
}
@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectModel('User') private readonly authModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  public async signUp(signUpDto: SignUpDto): Promise<{ token: string, userCreated : boolean }> {
    try {
        const { username, email, password, confirmPassword } = signUpDto;
        if(password !== confirmPassword){
          return {token: '', userCreated: false}

        }
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const user = await this.authModel.create({
          username,
          email,
          password: hashedPassword,
        });
        const token = await this.jwtService.signAsync({ id: user._id });
        return { token, userCreated: true };
    } catch (error) {
        console.error("error", error);
        throw new ExceptionsHandler();
    }
  }
  async login (loginDto: LoginDto): Promise<{token: string}>{
    const {email, password} = loginDto;
    const user = await this.authModel.findOne({email});
    if(!user){
        throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if(!isPasswordMatched){
        throw new UnauthorizedException('Invalid email or password');
    }
    const token = await this.jwtService.signAsync({ id: user._id });
        return { token };
  }
  public async createUser(createUserDTO: CreateUserDTO): Promise<string> {
    try {
      const newUser = new this.authModel({
        username: createUserDTO.username,
        email: createUserDTO.email,
        passowrd: uuid(),
        role: createUserDTO.role,
      });
      const generatedUser = await newUser.save();
      return generatedUser.id as string;
    } catch (error) {
      console.error('error', error);
      throw new BadRequestException('Could not create a user');
    }
  }
}
