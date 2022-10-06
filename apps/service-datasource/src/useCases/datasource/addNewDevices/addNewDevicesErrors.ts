import {HttpErrors} from "@iot-platforms/core";

export namespace AddNewDevicesErrors {
  export class DatasourceDontExists extends HttpErrors {
    constructor(key: string){
      super(`Data source with key ${key} not found`)
    }
  }

  export class DeviceKeyIsInvalid extends HttpErrors {
    constructor(message: string){
      super(message)
    }
  }
}

