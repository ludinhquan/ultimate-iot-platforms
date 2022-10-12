import {BadRequestError} from "@iot-platforms/core/errors/bad-request.error"
import {NotFoundError} from "@iot-platforms/core/errors/not-found.error"

export namespace CreateConnectionErrors {
  export class CreateConnectionBadRequest extends BadRequestError {
    constructor(message: string) {
      super(message)
    }
  }

  export class DatasourceNotFound extends NotFoundError {
    constructor(datasourceIds: string) {
      super(`Datasource not found ids "${datasourceIds}"`)
    }
  }

  export class DeviceDontMatchWithDatasource extends BadRequestError {
    constructor(deviceKey: string, datasourceId: string) {
      super(`Device ${deviceKey} is not included in datasource ${datasourceId}`)
    }
  }
}
