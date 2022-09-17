import {CurrentOrganization, CurrentUser, JwtAuthGuard} from "@iot-platforms/core";
import {Controller, Get, UseGuards} from "@nestjs/common";

@Controller()
@UseGuards(JwtAuthGuard)
export class AppController{
  constructor(){
    console.log('AppController')
  }

  @Get()
  get(
    @CurrentUser() user: IUser,
    @CurrentOrganization() organization: IOrganization
  ){
    return organization
  }
}
