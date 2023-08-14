import { inject, injectable } from "inversify";
import { userLoginDto } from "./dto/user-login.dto";
import { userRegisterDto } from "./dto/user-register.dto";
import { User } from "./user.entity";
import { TYPES } from "../types";
import { LoggerService } from "../logger/logger.service";
import { ConfigService } from "../config/config.service";
import { UserRepository } from "./user.repository";
import { User as UserModel } from "@prisma/client";

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.Logger) private logger: LoggerService,
    @inject(TYPES.ConfigService) private config: ConfigService,
    @inject(TYPES.UserRepository) private userRepo: UserRepository
  ) {}
  async createUser({
    email,
    password,
    name,
  }: userRegisterDto): Promise<UserModel | null> {
    const newUser = new User(email, name);
    const salt = this.config.get("SALT");
    await newUser.setPassword(password, Number(salt));
    const existedUser = await this.userRepo.find(email);
    if (existedUser) {
      return null;
    }

    return this.userRepo.create(newUser);
  }

  async validateUser({ email, password }: userLoginDto) {
    const existedUser = await this.userRepo.find(email);

    if (!existedUser) {
      return false;
    }

    const newUser = new User(
      existedUser.email,
      existedUser.name,
      existedUser.password
    );

    return newUser.comparePasswords(password);
  }
}
