import {HttpErrors, HttpExceptionKey} from "@iot-platforms/core";

export namespace AddNewDevicesErrors {
  export class DatasourceDontExists extends HttpErrors {
    code = 422
    key = HttpExceptionKey.NOT_FOUND_EXCEPTION

    constructor(key: string){
      super(`Data source with key ${key} not found`)
    }
  }

  export class DeviceKeyIsInvalid extends HttpErrors {
    code = 422
    key = HttpExceptionKey.BAD_REQUEST_EXCEPTION

    constructor(message: string){
      super(message)
    }
  }
}
