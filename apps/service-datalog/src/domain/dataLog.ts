import {Entity, UniqueEntityID} from "@iot-platforms/core";

type DataLogProps = {
  items: DataLog[]
}

export class DataLog extends Entity<DataLogProps> {

  constructor(props: DataLogProps, id?: UniqueEntityID) {
    super(props, id)
  }

  static create(props: DataLogProps, id?: UniqueEntityID) {

  }
}
