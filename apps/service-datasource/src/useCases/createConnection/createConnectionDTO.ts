import {Type} from "class-transformer"
import {IsNotEmpty, IsString, ValidateNested} from "class-validator"
import {ConnectionItem} from '../connectionDTO'

export class CreateConnectionDTO {
  @IsNotEmpty()
  @IsString()
  stationId: string

  @ValidateNested({each: true})
  @Type(() => ConnectionItem)
  items: ConnectionItem[]
}
