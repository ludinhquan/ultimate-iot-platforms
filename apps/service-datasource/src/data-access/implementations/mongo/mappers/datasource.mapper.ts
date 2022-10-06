import {UniqueEntityID} from "@iot-platforms/core";
import {Datasource, DatasourceKey} from "@svc-datasource/domain";
import {DatasourceOrmEntity} from "../entities";

export class DatasourceMapper {
  static toDomain(ormEntity: DatasourceOrmEntity): Datasource {
    return Datasource.create(
      {
        key: DatasourceKey.create({value: ormEntity.key}).getValue(),
        type: ormEntity.type
      },
      new UniqueEntityID(ormEntity._id))
      .getValue()
  }

  static toPersistence(entity: Datasource): DatasourceOrmEntity {
    return {
      _id: entity.datasourceId.value as string,
      key: entity.key.value,
      type: entity.type,
    }
  }
}
