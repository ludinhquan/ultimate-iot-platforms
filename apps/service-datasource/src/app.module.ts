import {ServiceRegistryModule} from "@iot-platforms/core";
import {MongoCoreModule} from "@iot-platforms/data-access/databases";
import {Module} from "@nestjs/common";
import {CreateDatasourceController} from "./useCases/datasource/createDatasource";

@Module({
  imports: [
    ServiceRegistryModule,
    MongoCoreModule.forRootAsync()
  ],
  controllers: [CreateDatasourceController]
})
export class AppModule { }
