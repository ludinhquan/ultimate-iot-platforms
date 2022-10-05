import {IRepository} from "@iot-platforms/data-access";
import {Datasource, DatasourceId, DatasourceKey, Devices} from "apps/service-datasource/src/domain";

export const DataSourceRepository = Symbol('IDataSourceRepository');

export interface IDataSourceRepository extends IRepository {
  exists(datasourceId: DatasourceId): Promise<boolean>,
  existByKey(datasourceKey: DatasourceKey): Promise<boolean>,
  save(datasource: Datasource): Promise<void>,
  find(): Promise<Datasource[]>
  findByKey(datasourceKey: DatasourceKey): Promise<Datasource|null>
  getDevicesByDatasourceId(datasourceId: DatasourceId): Promise<Devices>
}
