import "dotenv/config";
import type { NextFunction, Request, Response } from "express";
declare global {
    namespace Express {
        interface Request {
            id?: string | object;
        }
    }
}
declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export default authMiddleware;
//# sourceMappingURL=middleware.d.ts.map