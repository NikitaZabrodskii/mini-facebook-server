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
exports.UserController = void 0;
const http_error_class_1 = require("./../http-error.class");
const base_controller_1 = require("../common/base.controller");
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../types");
const user_service_1 = require("./user.service");
const user_register_dto_1 = require("./dto/user-register.dto");
const validation_middleware_1 = require("../common/validation.middleware");
const user_login_dto_1 = require("./dto/user-login.dto");
const jwt_controller_1 = require("../common/jwt.controller");
let UserController = exports.UserController = class UserController extends base_controller_1.BaseController {
    constructor(logger, userService, jwtController) {
        super(logger);
        this.userService = userService;
        this.jwtController = jwtController;
        this.bindRoutes([
            {
                path: "/login",
                method: "post",
                func: this.login,
                middleware: [new validation_middleware_1.ValidateMiddleware(user_login_dto_1.userLoginDto)],
            },
            {
                path: "/register",
                method: "post",
                func: this.register,
                middleware: [new validation_middleware_1.ValidateMiddleware(user_register_dto_1.userRegisterDto)],
            },
        ]);
    }
    login({ body }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userService.validateUser(body);
            if (!result) {
                return this.send(res, 401, "Invalid credentials");
            }
            const accessToken = this.jwtController.createAccessToken(body.email);
            const refreshToken = this.jwtController.createRefreshToken(body.email);
            res.cookie("accessToken", accessToken, {
                maxAge: 300000,
                httpOnly: true,
            });
            res.cookie("refreshToken", refreshToken, {
                maxAge: 3.154e10,
                httpOnly: true,
            });
            return this.send(res, 200, this.jwtController.verifyJWT(accessToken).payload);
        });
    }
    register({ body }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("register");
            const result = yield this.userService.createUser(body);
            if (!result) {
                return next(new http_error_class_1.HTTPError(401, "ошибка авторизации", "login"));
            }
            return this.ok(res, "successfully registered");
        });
    }
    logOut(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.cookie("accessToken", "", {
                maxAge: 0,
                httpOnly: true,
            });
            res.cookie("refreshToken", "", {
                maxAge: 0,
                httpOnly: true,
            });
            return this.send(res, 200, "logged out");
        });
    }
    getSessionHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(res, 200, req.user);
        });
    }
};
exports.UserController = UserController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Logger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.UserService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.JWTController)),
    __metadata("design:paramtypes", [Object, user_service_1.UserService,
        jwt_controller_1.JWTController])
], UserController);
//# sourceMappingURL=user.controller.js.map