import {Devices, SystemDevices} from "../entities";

export class DatasourceService {
  mappingSystemKey(devices: Devices, systemDevices: SystemDevices){
    devices.getItems().map(device => {
      device.updateSystemKey(systemDevices.get(device.key.value)?.key)
    })
  }
}
