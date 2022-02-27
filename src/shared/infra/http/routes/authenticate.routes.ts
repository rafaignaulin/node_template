import { Router } from "express";
import { AuthenticateUserController } from "@modules/accounts/useCases/authenticateUser/AuthenticateUseController";
import { RefreshTokenController } from "@modules/accounts/useCases/refreshToken/RefreshTokenController";

export const authenticateRoutes = Router();

const authenticateUserController = new AuthenticateUserController();
const refreshTokenController = new RefreshTokenController();

authenticateRoutes.post("/sessions", authenticateUserController.handle);

authenticateRoutes.post("/refresh-token", refreshTokenController.handle);
