"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appBindings = void 0;
const inversify_1 = require("inversify");
const app_1 = require("./app");
const types_1 = require("./types");
const logger_service_1 = require("./logger/logger.service");
const user_controller_1 = require("./users/user.controller");
const config_service_1 = require("./config/config.service");
const prisma_service_1 = require("./database/prisma.service");
const user_repository_1 = require("./users/user.repository");
const user_service_1 = require("./users/user.service");
const jwt_controller_1 = require("./common/jwt.controller");
exports.appBindings = new inversify_1.ContainerModule((bind) => {
    bind(types_1.TYPES.Application).to(app_1.App);
    bind(types_1.TYPES.Logger).to(logger_service_1.LoggerService).inSingletonScope();
    bind(types_1.TYPES.UserController).to(user_controller_1.UserController);
    bind(types_1.TYPES.ConfigService).to(config_service_1.ConfigService);
    bind(types_1.TYPES.PrismaService).to(prisma_service_1.PrismaService);
    bind(types_1.TYPES.UserRepository).to(user_repository_1.UserRepository);
    bind(types_1.TYPES.UserService).to(user_service_1.UserService);
    bind(types_1.TYPES.JWTController).to(jwt_controller_1.JWTController);
});
function start() {
    const appContainer = new inversify_1.Container();
    appContainer.load(exports.appBindings);
    const app = appContainer.get(types_1.TYPES.Application);
    app.init();
    return { app, appContainer };
}
start();
//# sourceMappingURL=main.js.map