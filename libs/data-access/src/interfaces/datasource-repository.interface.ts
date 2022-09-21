import {Datasource, DatasourceId, DatasourceKey, Devices} from "apps/service-datasource/src/domain";
import {IRepo} from "./base-repository.interface";

export interface IDataSourceRepository extends IRepo{
  exists(datasourceId: DatasourceId): Promise<boolean>,
  existByKey(key: DatasourceKey): Promise<boolean>,
  save(datasource: Datasource): Promise<void>,
  find(): Promise<Datasource[]>
  getDevicesByDatasourceId(datasourceId: DatasourceId): Promise<Devices>
}
