import {Result, UseCaseError} from "@iot-platforms/core"

export namespace CreateConnectionErrors {
  export class DeviceKeyIsInvalid extends Result<UseCaseError> {
    constructor() {
      super(false, 'Device key is invalid')
    }
  }

  export class DatasourcesNotFound extends Result<UseCaseError> {
    constructor(datasourceIds: string) {
      super(false, `Couldn't found datasources by ids "${datasourceIds}"`)
    }
  }

  export class DeviceDontMatchDatasource extends Result<UseCaseError> {
    constructor(deviceKey: string, datasourceKey: string) {
      super(false, `Device ${deviceKey} is not included in datasource  with key ${datasourceKey} devices`)
    }
  }
}
