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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const dotenv_1 = require("dotenv");
const inversify_1 = require("inversify");
const types_1 = require("../types");
const logger_service_1 = require("../logger/logger.service");
let ConfigService = exports.ConfigService = class ConfigService {
    constructor(logger) {
        this.logger = logger;
        const result = (0, dotenv_1.config)();
        if (result.error) {
            this.logger.error("[ConfigService] can't read env");
        }
        this.config = result.parsed;
        this.logger.log("[ConfigService] successfully read env");
    }
    get(key) {
        return this.config[key];
    }
};
exports.ConfigService = ConfigService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Logger)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], ConfigService);
//# sourceMappingURL=config.service.js.map