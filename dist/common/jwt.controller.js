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
exports.JWTController = void 0;
const inversify_1 = require("inversify");
const jsonwebtoken_1 = require("jsonwebtoken");
const types_1 = require("../types");
const logger_service_1 = require("../logger/logger.service");
const config_service_1 = require("../config/config.service");
let JWTController = exports.JWTController = class JWTController {
    constructor(logger, config) {
        this.logger = logger;
        this.config = config;
    }
    signJWT(email, expiresIn) {
        const privateKey = this.config.get("PRIVATE_KEY");
        return (0, jsonwebtoken_1.sign)({ email }, privateKey, { algorithm: "RS256", expiresIn });
    }
    verifyJWT(token) {
        try {
            const publicKey = this.config.get("PUBLIC_KEY");
            const decoded = (0, jsonwebtoken_1.verify)(token, publicKey);
            this.logger.log("[JWTController] token successfully verified");
            return { payload: decoded, expired: false };
        }
        catch (e) {
            this.logger.error("[JWTController]", e);
            return { payload: null, expired: false };
        }
    }
    checkJWT(req, res, next) {
        var _a;
        const accessToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
        console.log(accessToken);
        if (!accessToken) {
            return next();
        }
        const { payload } = this.verifyJWT(accessToken);
        if (payload) {
            req.user = payload;
            return next();
        }
        return next();
    }
};
exports.JWTController = JWTController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Logger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        config_service_1.ConfigService])
], JWTController);
//# sourceMappingURL=jwt.controller.js.map