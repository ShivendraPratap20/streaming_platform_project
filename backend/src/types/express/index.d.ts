import "express";

declare global {
  namespace Express {
    interface Request {
      isAuthenticated?: boolean;
      authenticatedUserData?: any
    }
  }
}

export {};