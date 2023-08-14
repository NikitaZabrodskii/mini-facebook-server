import { inject, injectable } from "inversify";
import { sign, verify } from "jsonwebtoken";
import { TYPES } from "../types";
import { LoggerService } from "../logger/logger.service";
import { ConfigService } from "../config/config.service";
import { NextFunction, Request, Response } from "express";

@injectable()
export class JWTController {
  constructor(
    @inject(TYPES.Logger) private logger: LoggerService,
    @inject(TYPES.ConfigService) private config: ConfigService
  ) {}
  signJWT(email: string, expiresIn: string | number) {
    const privateKey = this.config.get("PRIVATE_KEY");
    return sign({ email }, privateKey, { algorithm: "RS256", expiresIn });
  }

  verifyJWT(token: string) {
    try {
      const publicKey = this.config.get("PUBLIC_KEY");
      const decoded = verify(token, publicKey);
      this.logger.log("[JWTController] token successfully verified");
      return { payload: decoded, expired: false };
    } catch (e) {
      this.logger.error("[JWTController]", e);
      return { payload: null, expired: false };
    }
  }

  checkJWT(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies?.accessToken;
    console.log(accessToken);

    if (!accessToken) {
      return next();
    }

    const { payload } = this.verifyJWT(accessToken);

    if (payload) {
      ///@ts-ignore
      req.user = payload;

      return next();
    }

    return next();
  }
}
