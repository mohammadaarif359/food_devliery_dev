"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
exports.VendorRoute = router;
// multer image storage set
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '' + file.originalname);
    }
});
// image fields name
const images = (0, multer_1.default)({ storage: imageStorage }).array('images', 10);
// login
router.post('/login', controllers_1.VendorLogin);
// set authenticate middlware
router.use(middlewares_1.Authenticate);
// profile get
router.get('/profile', controllers_1.GetVendorProfile);
// profile update
router.patch('/profile', controllers_1.UpdateVendorProfile);
// servie update
router.patch('/service', controllers_1.UpdateVendorService);
// cover image update
router.patch('/coverimage', images, controllers_1.UpdateVendorCoverImage);
// food
router.post('/food', images, controllers_1.AddFood);
router.get('/foods', controllers_1.GetFood);
// get
router.get('/', (req, res, next) => {
    res.json({ "msg": "hello vendor route" });
});
//# sourceMappingURL=VendorRoute.js.map