import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "./guard";

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.register({})
  ],
  providers: [
    JwtStrategy, 
  ]
})
export class AuthModule {}
