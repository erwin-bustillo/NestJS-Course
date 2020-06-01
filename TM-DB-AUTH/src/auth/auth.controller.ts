import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {

  constructor(private authService:AuthService){

  }
  @Post('/signUp')
  signUp(@Body(ValidationPipe) authCredentialsDto:AuthCredentialsDto){
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signIn')
  signIn(@Body(ValidationPipe) authCredentialsDto:AuthCredentialsDto):Promise<{accessToken:string}>{
    return this.authService.signIn(authCredentialsDto);
  }
}
