import jwt from "jsonwebtoken";
import "dotenv/config";
const authMiddleware = function (req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        res.status(403).json({});
    }
    const token = auth?.split(" ")[1];
    try {
        if (token == undefined) {
            throw new Error("token undedined");
        }
        const decode = jwt.verify(token, `${process.env.JWT_SECRET}`);
        req.id = decode.id;
        console.log(decode.id);
        next();
    }
    catch (error) {
        res.status(403).json({});
    }
};
export default authMiddleware;
//# sourceMappingURL=middleware.js.map