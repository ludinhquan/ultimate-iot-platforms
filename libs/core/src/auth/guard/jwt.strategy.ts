import {Injectable, UnauthorizedException} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      secretOrKey: configService.get('JWT_SECRET_KEY')??'ada',
    })
  }

  async validate(validatedUser: any) {
    try {
      const organization: IOrganization = {
        id: validatedUser.organization._id,
        name: validatedUser.organization.name,
      }

      const user: IUser = {
        id: validatedUser._id,
        firstName: validatedUser.firstName,
        lastName: validatedUser.lastName,
        isAdmin: validatedUser.isAdmin,
        isOwner: validatedUser.isOwner,
        isActive: validatedUser.isActive,
        iat: validatedUser.iat,
        organization
      }

      return user
    } catch (e) {
      throw new UnauthorizedException()
    }
  }
}
