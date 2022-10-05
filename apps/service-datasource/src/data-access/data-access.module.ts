import {MongoCoreModule} from "@iot-platforms/data-access";
import {Module} from "@nestjs/common";
import {RepositoryManager} from "./implementations";

@Module({
  imports: [MongoCoreModule.forRootAsync()],
  providers: [RepositoryManager],
  exports: [RepositoryManager]
})
export class DataAccessModule {}


