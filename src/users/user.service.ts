import { inject, injectable } from "inversify";
import { userLoginDto } from "./dto/user-login.dto";
import { userRegisterDto } from "./dto/user-register.dto";
import { User } from "./user.entity";
import { TYPES } from "../types";
import { LoggerService } from "../logger/logger.service";
import { ConfigService } from "../config/config.service";

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.Logger) private logger: LoggerService,
    @inject(TYPES.ConfigService) private config: ConfigService
  ) {}
  async createUser({ email, password, name }: userRegisterDto) {
    const user = new User(email, name);
    const salt = this.config.get("SALT");
    await user.setPassword(password, Number(salt));
    ///check is user exists
    /// if not give an exception

    /// if yes create password
    /// add to database
  }

  async validateUser({ email, password }: userLoginDto) {}
}
