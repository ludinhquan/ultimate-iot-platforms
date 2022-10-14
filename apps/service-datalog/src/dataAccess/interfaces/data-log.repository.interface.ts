import {DataLog} from "../../domain";

export interface IDataLogRepository {
  writeData(log: DataLog): Promise<boolean>
}
