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

  createAccessToken(email: string) {
    return this.signJWT(email, "5m");
  }

  createRefreshToken(email: string) {
    return this.signJWT(email, "1y");
  }

  verifyJWT(token: string) {
    try {
      const publicKey = this.config.get("PUBLIC_KEY");
      const decoded = verify(token, publicKey);
      this.logger.log("[JWTController] token successfully verified");
      return { payload: decoded, expired: false };
    } catch (e) {
      this.logger.error("[JWTController]", e);
      //@ts-ignore
      return { payload: null, expired: e.message.includes("jwt expired") };
    }
  }

  checkJWT(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;
    console.log({ accessToken });
    console.log({ refreshToken });

    /// if no access token and refresh token
    if (!accessToken && !refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    /// if access token exists
    if (accessToken && !refreshToken) {
      /// validate access token
      const { payload, expired } = this.verifyJWT(accessToken);

      /// for a valid access token
      if (payload) {
        //@ts-ignore
        const newRefreshToken = this.createRefreshToken(payload.email);

        res.cookie("refreshToken", newRefreshToken, {
          maxAge: 3.154e10,
          httpOnly: true,
        });

        return next();
      }

      // for an expired access token
      if (expired) {
        /// check if refresh token is valid
        const { payload: refreshPayload, expired: refreshExpired } =
          this.verifyJWT(refreshToken);

        /// if refresh token is valid
        if (refreshPayload) {
          /// @ts-ignore
          const newAccessToken = this.createAccessToken(refreshPayload.email);
          res.cookie("accessToken", newAccessToken, {
            maxAge: 300000,
            httpOnly: true,
          });
          return next();
        }

        /// if refresh token is expired
        if (refreshExpired) {
          return res.status(401).json({ message: "Unauthorized" });
        }
      }

      /// if access token is invalid
      return res.status(401).json({ message: "Unauthorized" });
    }

    /// if access token is not exists and refresh token exists
    if (!accessToken && refreshToken) {
      /// check if refresh token is valid
      const { payload, expired } = this.verifyJWT(refreshToken);

      /// if refresh token is valid
      if (payload) {
        /// @ts-ignore
        const newAccesToken = this.createAccessToken(payload.email);

        res.cookie("accessToken", newAccesToken, {
          maxAge: 300000,
          httpOnly: true,
        });

        return next();
      }

      /// if refresh token is expired
      if (expired) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      /// if refresh token is invalid
      return res.status(401).json({ message: "Unauthorized" });
    }

    return next();
  }
}
