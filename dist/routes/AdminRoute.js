"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.AdminRoute = router;
// create
router.post('/vendor', controllers_1.CreateVendor);
// get
router.get('/vendors', controllers_1.GetVendors);
// get by id
router.get('/vendor/:id', controllers_1.GetVendorById);
// get
router.get('/', (req, res, next) => {
    res.json({ "msg": "hello admin route" });
});
//# sourceMappingURL=AdminRoute.js.map