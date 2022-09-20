import {Datasource, DatasourceId, DatasourceKey, Devices} from "apps/service-datasource/src/domain";

export interface IDatasourceRepository {
  exists(query: {key?: DatasourceKey, datasourceId?: DatasourceId}): Promise<boolean>,
  save(datasource: Datasource): Promise<void>,
  getDevicesByDatasourceId(): Promise<Devices>
}
