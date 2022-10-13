import {ValueObject} from "@iot-platforms/core";

export type DataLogItemProps = {
  key: string,
  value: string,
  statusDevice: string
}

export class DataLogItem extends ValueObject<DataLogItemProps>{}
