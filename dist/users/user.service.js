"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const inversify_1 = require("inversify");
const user_entity_1 = require("./user.entity");
const types_1 = require("../types");
const logger_service_1 = require("../logger/logger.service");
const config_service_1 = require("../config/config.service");
const user_repository_1 = require("./user.repository");
let UserService = exports.UserService = class UserService {
    constructor(logger, config, userRepo) {
        this.logger = logger;
        this.config = config;
        this.userRepo = userRepo;
    }
    createUser({ email, password, name, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = new user_entity_1.User(email, name);
            const salt = this.config.get("SALT");
            yield newUser.setPassword(password, Number(salt));
            const existedUser = yield this.userRepo.find(email);
            if (existedUser) {
                return null;
            }
            return this.userRepo.create(newUser);
        });
    }
    validateUser({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const existedUser = yield this.userRepo.find(email);
            if (!existedUser) {
                return false;
            }
            const newUser = new user_entity_1.User(existedUser.email, existedUser.name, existedUser.password);
            return newUser.comparePasswords(password);
        });
    }
};
exports.UserService = UserService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Logger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.UserRepository)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        config_service_1.ConfigService,
        user_repository_1.UserRepository])
], UserService);
//# sourceMappingURL=user.service.js.map