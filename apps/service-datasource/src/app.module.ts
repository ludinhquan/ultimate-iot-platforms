import {AuthModule, ServiceRegistryModule} from "@iot-platforms/core";
import {Module} from "@nestjs/common";
import {AppController} from "./app.controller";

@Module({
  imports: [
    AuthModule, 
    ServiceRegistryModule,
  ],
  controllers: [AppController]
})
export class AppModule { }
