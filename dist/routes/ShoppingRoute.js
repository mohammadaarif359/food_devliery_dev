"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.ShoppingRoute = router;
/*  Food Avaialibity  */
router.get('/:pincode', controllers_1.GetFoodAvailibility);
/*  Top Resturants  */
router.get('/top-resturant/:pincode', controllers_1.GetTopResturant);
/*  Food Avaialible in 30 min  */
router.get('/food-in-30-min/:pincode', controllers_1.GetFoodIn30Min);
/*  Search Foods  */
router.get('/search/:pincode', controllers_1.SearchFood);
/*  By Resturant By Id */
router.get('/restuant/:id', controllers_1.GetResturantById);
//# sourceMappingURL=ShoppingRoute.js.map