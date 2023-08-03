import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./app";
import { TYPES } from "./types";
import { ILogger } from "./logger/logger.interface";
import { LoggerService } from "./logger/logger.service";
import { BaseController } from "./common/base.controller";
import { UserController } from "./users/user.controller";
import { ConfigService } from "./config/config.service";

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<App>(TYPES.Application).to(App);
  bind<ILogger>(TYPES.Logger).to(LoggerService).inSingletonScope();
  bind<UserController>(TYPES.UserController).to(UserController);
  bind<ConfigService>(TYPES.ConfigService).to(ConfigService);
});

function start() {
  const appContainer = new Container();
  appContainer.load(appBindings);
  const app = appContainer.get<App>(TYPES.Application);
  app.init();
  return { app, appContainer };
}

start();
