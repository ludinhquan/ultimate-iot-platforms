import {HttpErrors, HttpExceptionKey} from "@iot-platforms/core"

export namespace CreateConnectionErrors {
  export class DeviceKeyIsInvalid extends HttpErrors {
    code = 422
    key = HttpExceptionKey.BAD_REQUEST_EXCEPTION

    constructor(){
      super(`Device key is invalid`)
    }
  }
}
