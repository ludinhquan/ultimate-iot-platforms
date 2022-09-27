import {Global, Module} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "./guard";

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.register({})
  ],
  providers: [
    JwtStrategy, 
  ]
})
export class AuthModule {}
