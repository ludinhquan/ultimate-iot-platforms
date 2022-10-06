import {MongoRepository} from "typeorm";
import {IConnectionRepository} from "../../../interfaces";
import {ConnectionOrmEntity} from "../entities";

export class ConnectionRepositoryImpl implements IConnectionRepository {
  constructor(
    private connectionRepo: MongoRepository<ConnectionOrmEntity>
  ){ }

  async save(){
    // this.connectionRepo.save(, options)
  }
}
