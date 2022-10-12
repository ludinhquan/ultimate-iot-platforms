import {MeasuringLogs} from "@iot-platforms/contracts";
import {ConnectionItems} from "@svc-datasource/domain";
import {UpdateDatasourceDTO} from "./updateDatasourceDTO";

export class UpdateDatasourceMapper {
  static transformDataLogs(dto: UpdateDatasourceDTO, items: ConnectionItems): MeasuringLogs {
    const {measuringLogs} = dto;
    const data = items.getItems()
      .filter(item => item.isValid && measuringLogs[item.deviceKey.value])
      .map(item => ({
        key: item.systemKey.value,
        value: item.ratio * measuringLogs[item.deviceKey.value].value,
        statusDevice: measuringLogs[item.deviceKey.value].statusDevice,
      }))
      .reduce(
        (prev: MeasuringLogs, item) => ({
          ...prev,
          [item.key]: {value: item.value, statusDevice: item.statusDevice}
        }),
        {}
      );

    return data
  }
}
