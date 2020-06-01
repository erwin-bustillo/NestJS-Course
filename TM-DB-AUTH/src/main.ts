import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const serverConfig:any = config.get('server');
  const app = await NestFactory.create(AppModule);
  
  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  }else{
    app.enableCors({origin: serverConfig.origin})
  }

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
}
bootstrap();
