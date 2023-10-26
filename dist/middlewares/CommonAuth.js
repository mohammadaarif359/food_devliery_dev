"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticate = void 0;
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.headers.authorization) {
        try {
            const token = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization.split(" ")[1];
            const payload = yield jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
            req.user = payload;
            next();
        }
        catch (err) {
            return res.status(401).json({ "message": "Unauthorzied" });
        }
    }
    else {
        return res.status(401).json({ "message": "Unauthorzied" });
    }
});
exports.Authenticate = Authenticate;
//# sourceMappingURL=CommonAuth.js.map