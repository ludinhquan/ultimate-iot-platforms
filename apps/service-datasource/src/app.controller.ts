import {CurrentUser, JwtAuthGuard} from "@iot-platforms/core";
import {Controller, Get, UseGuards} from "@nestjs/common";

@Controller()
@UseGuards(JwtAuthGuard)
export class AppController{

  @Get()
  get(
    @CurrentUser() user: IUser,
  ){
    return user
  }
}
