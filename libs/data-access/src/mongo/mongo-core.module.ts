import {DATABASE_ADMIN} from "@iot-platforms/data-access/constants";
import {DynamicModule, Inject, Module, OnApplicationShutdown} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import * as path from "path";
import {DataSource} from "typeorm";
import {MongoConnectionOptions} from "typeorm/driver/mongodb/MongoConnectionOptions";
import {MultiTenantService} from "./multitenant.service";
import {TypeormHelperService} from "./typeorm.helper";

@Module({
  imports: [ConfigModule],
  providers: [MultiTenantService, TypeormHelperService],
  exports: [TypeormHelperService]
})
export class MongoCoreModule implements OnApplicationShutdown {

  constructor(
    @Inject(DATABASE_ADMIN) private datasourceAdmin: DataSource,
  ){}
  
  static forRootAsync(): DynamicModule {
    const adminClientProvider = {
      provide: DATABASE_ADMIN,
      useFactory: async (configService: ConfigService) => {
        const options: MongoConnectionOptions = {
          type: 'mongodb',
          host: configService.getOrThrow('MONGODB_ADMIN_HOST'),
          port: configService.get('MONGODB_ADMIN_PORT'),
          username: configService.getOrThrow('MONGODB_ADMIN_USER'),
          database: configService.getOrThrow('MONGODB_ADMIN_DATABASE'),
          password: configService.getOrThrow('MONGODB_ADMIN_PASS'),
          entities: [
            path.join(__dirname, '/entities/*.orm-entity.js')
          ]
        }
        const datasource = new DataSource(options);
        await datasource.initialize()
        return datasource
      },
      inject: [ConfigService],
    };

    return {
      module: MongoCoreModule,
      providers: [adminClientProvider, MultiTenantService],
      exports: [MultiTenantService]
    }
  }

  async onApplicationShutdown() {
    if(this.datasourceAdmin.isInitialized) await this.datasourceAdmin.destroy()
  }
}

