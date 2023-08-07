import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./app";
import { TYPES } from "./types";
import { ILogger } from "./logger/logger.interface";
import { LoggerService } from "./logger/logger.service";
import { UserController } from "./users/user.controller";
import { ConfigService } from "./config/config.service";
import { PrismaService } from "./database/prisma.service";
import { UserRepository } from "./users/user.repository";
import { UserService } from "./users/user.service";

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<App>(TYPES.Application).to(App);
  bind<ILogger>(TYPES.Logger).to(LoggerService).inSingletonScope();
  bind<UserController>(TYPES.UserController).to(UserController);
  bind<ConfigService>(TYPES.ConfigService).to(ConfigService);
  bind<PrismaService>(TYPES.PrismaService).to(PrismaService);
  bind<UserRepository>(TYPES.UserRepository).to(UserRepository);
  bind<UserService>(TYPES.UserService).to(UserService);
});

function start() {
  const appContainer = new Container();
  appContainer.load(appBindings);
  const app = appContainer.get<App>(TYPES.Application);
  app.init();
  return { app, appContainer };
}

start();
