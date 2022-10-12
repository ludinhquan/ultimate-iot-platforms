import {Type} from "class-transformer"
import {ValidateNested} from "class-validator"
import {ConnectionItem} from '../connectionDTO'

export class UpdateItemsDTO {
  @ValidateNested({each: true})
  @Type(() => ConnectionItem)
  items: ConnectionItem[]
}

