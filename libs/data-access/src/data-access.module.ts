import {Module} from "@nestjs/common";
import {MongoCoreModule} from "./databases";
import {RepositoryManager} from "./repo-manager.service";

@Module({
  imports: [MongoCoreModule.forRootAsync()],
  providers: [RepositoryManager],
  exports: [RepositoryManager]
})
export class DataAccessModule {}
