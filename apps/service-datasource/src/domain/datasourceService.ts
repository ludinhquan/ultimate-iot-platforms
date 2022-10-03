import {Injectable} from "@nestjs/common";
import {Datasource, Devices} from "./entities";

@Injectable()
export class DatasourceService {
  constructor(){}
  
  updateDevices(datasource: Datasource, devices: Devices){

  }
}
