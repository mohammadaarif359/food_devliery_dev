"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.CustomerRoute = router;
/*  Signup  */
router.post('/signup', controllers_1.CustomerSingUp);
/*  Login  */
router.post('/login', controllers_1.CustomerLogin);
/* after this all route reuqired authentication */
router.use(middlewares_1.Authenticate);
/*  Verify Account  */
router.post('/verify', controllers_1.CustomerVerify);
/*  Otp  */
router.get('/otp', controllers_1.RequestOtp);
/*  Profile get */
router.get('/profile', controllers_1.GetCustomerProfile);
/* Profile update */
router.patch('/profile', controllers_1.UpdateCustomerProfile);
//# sourceMappingURL=CustomerRoute.js.map