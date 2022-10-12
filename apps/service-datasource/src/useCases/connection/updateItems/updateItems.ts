import {Either, Result, right, UnexpectedError, UseCase} from "@iot-platforms/core";
import {UpdateItemsDTO} from "./updateItemsDTO";

export type UpdateItemsResponse<T = void> = Either<
  UnexpectedError,
  Result<T>
>

export class UpdateItemsUseCase implements UseCase<UpdateItemsDTO, UpdateItemsResponse>{

  async execute(dto: UpdateItemsDTO): Promise<UpdateItemsResponse<void>> {

    return right(Result.ok())
  }
}
