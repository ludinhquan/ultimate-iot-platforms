import {HttpErrors} from "@iot-platforms/core/core/error";

export namespace CreateDatasourceErrors {
  export class DatasourceAlreadyExist extends HttpErrors {
    constructor (key: string) {
      super(`Datasource with key ${key} has been created`)
    }
  }

  export class DeviceKeyIsInvalid extends HttpErrors {
    constructor(message: string){
      super(message)
    }
  }
}
