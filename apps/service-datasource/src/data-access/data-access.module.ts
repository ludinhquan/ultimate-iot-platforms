import {MongoCoreModule} from "@iot-platforms/data-access";
import {Module, Provider} from "@nestjs/common";
import {ConnectionRepositoryImpl, DataSourceRepositoryImpl, DeviceRepositoryImpl, RepositoryManager, SystemDeviceRepositoryImpl} from "./implementations";
import {ConnectionRepository, DataSourceRepository, DeviceRepository, SystemDeviceRepository} from "./interfaces";

const repoProviders: (Provider & {export: boolean})[] = [
  {
    provide: DataSourceRepository,
    useClass: DataSourceRepositoryImpl,
    export: true
  },
  {
    provide: DeviceRepository,
    useClass: DeviceRepositoryImpl, 
    export: false
  },
  {
    provide: SystemDeviceRepository,
    useClass: SystemDeviceRepositoryImpl,
    export: true
  },
  {
    provide: ConnectionRepository,
    useClass: ConnectionRepositoryImpl,
    export: true
  },
] 
@Module({
  imports: [MongoCoreModule.forRootAsync()],
  providers: [RepositoryManager, ...repoProviders],
  exports: [RepositoryManager, ...repoProviders.filter(item => item.export)]
})
export class DataAccessModule {}


