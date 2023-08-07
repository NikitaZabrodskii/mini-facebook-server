import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { PrismaService } from "../database/prisma.service";
import { userRegisterDto } from "./dto/user-register.dto";

@injectable()
export class UserRepository {
  constructor(@inject(TYPES.PrismaService) private prisma: PrismaService) {}

  async create({ email, password, name }: userRegisterDto) {
    return await this.prisma.client.user.create({
      data: {
        email,
        password,
        name,
      },
    });
  }

  async find(email: string) {
    return await this.prisma.client.user.findFirst({
      where: {
        email,
      },
    });
  }
}
