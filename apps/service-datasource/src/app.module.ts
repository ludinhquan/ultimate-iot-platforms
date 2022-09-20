import {ServiceRegistryModule} from "@iot-platforms/core";
import {Module} from "@nestjs/common";
import {CreateDatasourceController} from "./useCases/datasource/createDatasource";

@Module({
  imports: [
    ServiceRegistryModule,
  ],
  controllers: [CreateDatasourceController]
})
export class AppModule { }
