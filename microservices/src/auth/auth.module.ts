import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import {JwtModule} from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[JwtModule, PassportModule] ,
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
