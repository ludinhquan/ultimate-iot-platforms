import {ServiceRegistryModule} from "@iot-platforms/core";
import {DataAccessModule} from "@iot-platforms/data-access";
import {Module} from "@nestjs/common";
import {CreateDatasourceController} from "./useCases/datasource/createDatasource";

@Module({
  imports: [
    ServiceRegistryModule,
    DataAccessModule
  ],
  controllers: [CreateDatasourceController]
})
export class AppModule { }
