import {removeUndefinedProps} from "@iot-platforms/common";
import {Logger} from "@nestjs/common";
import {ConnectionId, ConnectionItem, ConnectionItems} from "@svc-datasource/domain";
import {MongoRepository} from "typeorm";
import {IConnectionItemRepository} from "../../../interfaces";
import {ConnectionItemOrmEntity} from "../entities";
import {ConnectionItemMapper} from "../mappers";

export class ConnectionItemRepositoryImpl implements IConnectionItemRepository {
  logger = new Logger(this.constructor.name)

  constructor(
    private repo: MongoRepository<ConnectionItemOrmEntity>,
  ){ }
  
  private buildBasicQuery(item: Partial<ConnectionItem>){
    const query = removeUndefinedProps({
      connectionId: item.connectionId?.value,
    })
    return query
  }

  async bulkSave(items: ConnectionItems) {
    const promises = items.getItems().map(item => {
      const ormEntity = ConnectionItemMapper.toPersistence(item);
      return this.repo.updateOne({_id: ormEntity._id}, {$set: ormEntity}, {upsert: true})
    });

    const result = await Promise.all(promises)

    return {total: result.length}
  }

  async find(connectionId: ConnectionId): Promise<ConnectionItems> {
    const query = this.buildBasicQuery({connectionId})

    const list = await this.repo.find(query);

    const items = list.map(ConnectionItemMapper.toDomain);
    return ConnectionItems.create(items).getValue()
  }
}
