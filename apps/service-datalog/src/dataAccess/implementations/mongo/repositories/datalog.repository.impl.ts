import {IDataLogRepository} from "@svc-datalog/dataAccess";
import {DataLog} from "@svc-datalog/domain";
import {MongoRepository} from "typeorm";
import {DataLogOrmEntity} from "../entities";

export class DataLogRepository implements IDataLogRepository {
  constructor(private dataRepo: MongoRepository<DataLogOrmEntity>){}

  async writeData(log: DataLog) {
    console.log(log)
    return true
  }
}
