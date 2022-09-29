import {Datasource, DatasourceId, DatasourceKey, Devices} from "apps/service-datasource/src/domain";
import {IRepo} from "./base-repository.interface";

export interface IDataSourceRepository extends IRepo{
  exists(datasourceId: DatasourceId): Promise<boolean>,
  existByKey(datasourceKey: DatasourceKey): Promise<boolean>,
  save(datasource: Datasource): Promise<void>,
  find(): Promise<Datasource[]>
  findByKey(datasourceKey: DatasourceKey): Promise<Datasource|null>
  getDevicesByDatasourceId(datasourceId: DatasourceId): Promise<Devices>
}
