import {removeUndefinedProps} from "@iot-platforms/common";
import {IDataSourceRepository} from "@iot-platforms/data-access/interfaces";
import {Datasource, DatasourceId, DatasourceKey, Devices} from "apps/service-datasource/src/domain";
import {MongoRepository} from "typeorm";
import {DatasourceOrmEntity} from "../entities";
import {DatasourceMapper} from "../mappers";

export class DataSourceRepository implements IDataSourceRepository{
  constructor(
    private repo: MongoRepository<DatasourceOrmEntity>
  ){ }

  private buildBasicQuery(datasource: Partial<Datasource>){
    const query = removeUndefinedProps({
      _id: datasource.datasourceId.value,
      key: datasource.key.value,
    })
    return query
  }

  async exists(datasourceId: DatasourceId): Promise<boolean> {
    const query = this.buildBasicQuery({datasourceId})
    const datasource = await this.repo.findOne(query);
    const found = !!datasource === true
    return found
  }

  async existByKey(datasourceKey: DatasourceKey): Promise<boolean> {
    const query = this.buildBasicQuery({key: datasourceKey})
    const datasource = await this.repo.findOne(query);
    const found = !!datasource === true
    return found
  }

  async save(datasource: Datasource): Promise<void> {
    const rawData = DatasourceMapper.toPersistence(datasource)
    const exists = await this.exists(datasource.datasourceId);
    const isNewDatasouce = !exists;
    if(isNewDatasouce) {
      await this.repo.save(rawData)
      return
    }

    const query = this.buildBasicQuery({datasourceId: datasource.datasourceId})
    await this.repo.updateOne(query, rawData)
  }
  
  async find(): Promise<Datasource[]> {
    const ormEntities = await this.repo.find()
    return ormEntities.map(DatasourceMapper.toDomain)
  }

  async getDevicesByDatasourceId(datasourceId: DatasourceId): Promise<Devices> {
    return
  }
}
