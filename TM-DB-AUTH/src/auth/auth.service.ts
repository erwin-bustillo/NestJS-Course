import { JwtPayload } from './jwt-payload.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository:UserRepository,
    private jwtService:JwtService
  ){}

  async signUp(authCredentialsDto:AuthCredentialsDto):Promise<void>{
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(authCredentialsDto:AuthCredentialsDto): Promise<{token: string}>{
    const username = await this.userRepository.validateUserPassword(authCredentialsDto);
    if(!username){
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload:JwtPayload = { username };
    const token = await this.jwtService.sign(payload);

    return { token };
  }

}
