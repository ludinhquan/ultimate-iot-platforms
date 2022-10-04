import {HttpErrors, HttpExceptionKey} from "@iot-platforms/core/core/error";

export namespace CreateDatasourceErrors {
  export class DatasourceAlreadyExist extends HttpErrors {
    code = 422
    key = HttpExceptionKey.BAD_REQUEST_EXCEPTION

    constructor (key: string) {
      super(`Datasource with key ${key} has been created`)
    }
  }

  export class DeviceKeyIsInvalid extends HttpErrors {
    code = 422
    key = HttpExceptionKey.NOT_FOUND_EXCEPTION

    constructor(message: string){
      super(message)
    }
  }
}
