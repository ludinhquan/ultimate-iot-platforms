import {IDataLogRepository} from "./data-log.repository.interface";

export interface DataAccessLayer {
  dataLogRepo(): IDataLogRepository
}
