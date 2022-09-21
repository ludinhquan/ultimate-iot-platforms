import {Global, Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {AuthModule} from "../auth";

@Global()
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({envFilePath: ['.env']})
  ],
  exports: [ConfigModule]
})
export class ServiceRegistryModule {}
