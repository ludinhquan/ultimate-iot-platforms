import {removeUndefinedProps} from "@iot-platforms/common";
import {Datasource, DatasourceId, DatasourceKey, Devices} from "@svc-datasource/domain";
import {MongoRepository} from "typeorm";
import {IDataSourceRepository, IDeviceRepository} from "../../../interfaces";
import {DatasourceOrmEntity} from "../entities";
import {DatasourceMapper} from "../mappers";

export class DataSourceRepositoryImpl implements IDataSourceRepository {
  constructor(
    private repo: MongoRepository<DatasourceOrmEntity>,
    private deviceRepo: IDeviceRepository
  ){ }

  private buildBasicQuery(datasource: Partial<Datasource>){
    const query = removeUndefinedProps({
      _id: datasource.datasourceId?.value,
      key: datasource.key?.value,
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
      await this.deviceRepo.bulkSave(datasource.devices)
      return
    }

    const query = this.buildBasicQuery({datasourceId: datasource.datasourceId})
    await this.repo.updateOne(query, {$set: rawData})
    await this.deviceRepo.bulkSave(datasource.devices)
  }
  
  async find(): Promise<Datasource[]> {
    const ormEntities = await this.repo.find()
    return ormEntities.map(DatasourceMapper.toDomain)
  }

  async findByIds(datasourceIds: DatasourceId[]): Promise<Datasource[]> {
    const ids = datasourceIds.map(datasourceId => datasourceId.value);
    const ormEntities = await this.repo.findBy({_id: {$in: ids}});
    return ormEntities.map(DatasourceMapper.toDomain);
  }

  async findByKey(datasourceKey: DatasourceKey): Promise<Datasource | null> {
    const ormEntity = await this.repo.findOneBy({key: datasourceKey.value})
    return ormEntity ? DatasourceMapper.toDomain(ormEntity) : null
  }

  async getDevicesByDatasourceId(datasourceId: DatasourceId): Promise<Devices> {
    return this.deviceRepo.find({datasourceId})
  }
}
