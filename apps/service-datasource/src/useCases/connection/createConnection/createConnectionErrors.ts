import {UseCaseCode, UseCaseError} from "@iot-platforms/core"

export namespace CreateConnectionErrors {
  export class BadRequest extends UseCaseError {
    constructor(message: string) {
      super({
        error: BadRequest.name,
        status: UseCaseCode.BadRequest,
        message: message,
      })
    }
  }

  export class DatasourceNotFound extends UseCaseError {
    constructor(datasourceIds: string) {
      super({
        error: DatasourceNotFound.name,
        status: UseCaseCode.NotFound,
        message: `Datasource not found ids "${datasourceIds}"`,
      })
    }
  }

  export class DeviceDontMatchWithDatasource extends UseCaseError {
    constructor(deviceKey: string, datasourceId: string) {
      super({
        message: `Device ${deviceKey} is not included in datasource ${datasourceId}`,
        error: DeviceDontMatchWithDatasource.name,
        status: UseCaseCode.BadRequest
      })
    }
  }
}
