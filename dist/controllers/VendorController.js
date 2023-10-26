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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFood = exports.AddFood = exports.UpdateVendorCoverImage = exports.UpdateVendorService = exports.UpdateVendorProfile = exports.GetVendorProfile = exports.VendorLogin = void 0;
const AdminController_1 = require("./AdminController");
const utility_1 = require("../utility");
const models_1 = require("../models");
const VendorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVendor = yield (0, AdminController_1.findVendor)('', email);
    if (existingVendor !== null) {
        const validatePassword = yield (0, utility_1.ValidatePassword)(password, existingVendor.password, existingVendor.salt);
        if (validatePassword) {
            const token = yield (0, utility_1.GenerateToken)({
                _id: existingVendor.id,
                name: existingVendor.name,
                email: existingVendor.email,
                foodType: existingVendor.foodType
            });
            return res.status(200).json({ user: existingVendor, token });
        }
        else {
            return res.status(400).json({ "message": "password inavalid" });
        }
    }
    return res.status(400).json({ "message": "email inavalid" });
});
exports.VendorLogin = VendorLogin;
const GetVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield (0, AdminController_1.findVendor)(req.user._id);
    if (vendor) {
        return res.status(200).json(vendor);
    }
    else {
        return res.status(204).json({ "message": "vendor not found" });
    }
});
exports.GetVendorProfile = GetVendorProfile;
const UpdateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, phone, foodType } = req.body;
    const vendor = yield (0, AdminController_1.findVendor)(req.user._id);
    if (vendor) {
        vendor.name = name;
        vendor.address = address;
        vendor.phone = phone;
        vendor.foodType = foodType;
        const updatedVendor = yield vendor.save();
        return res.status(200).json(updatedVendor);
    }
    else {
        return res.status(204).json({ "message": "vendor not found" });
    }
});
exports.UpdateVendorProfile = UpdateVendorProfile;
const UpdateVendorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, phone, foodType } = req.body;
    const vendor = yield (0, AdminController_1.findVendor)(req.user._id);
    if (vendor) {
        vendor.serviceAvialable = !vendor.serviceAvialable;
        const updatedVendor = yield vendor.save();
        return res.status(200).json(updatedVendor);
    }
    else {
        return res.status(204).json({ "message": "vendor not found" });
    }
});
exports.UpdateVendorService = UpdateVendorService;
const UpdateVendorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield (0, AdminController_1.findVendor)(req.user._id);
    if (vendor) {
        // get uploaded files
        const files = req.files;
        const images = files.map((file) => file.filename);
        vendor.converImages.push(...images);
        const result = yield vendor.save();
        return res.status(200).json(result);
    }
    else {
        return res.status(204).json({ "message": "vendor not found" });
    }
});
exports.UpdateVendorCoverImage = UpdateVendorCoverImage;
const AddFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, category, foodType, readyTime, price } = req.body;
    const vendor = yield (0, AdminController_1.findVendor)(req.user._id);
    if (vendor) {
        // get uploaded files
        const files = req.files;
        const images = files.map((file) => file.filename);
        const createFood = yield models_1.Food.create({
            vendorId: vendor._id,
            name,
            description,
            category,
            foodType,
            readyTime,
            price,
            images: images,
            rating: 0
        });
        vendor.foods.push(createFood);
        const result = yield vendor.save();
        return res.status(200).json(result);
    }
    else {
        return res.status(204).json({ "message": "vendor not found" });
    }
});
exports.AddFood = AddFood;
const GetFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const foods = yield models_1.Food.find({ vendorId: user._id });
    if (foods) {
        return res.status(200).json(foods);
    }
    else {
        return res.status(204).json({ "message": "vendor not found" });
    }
});
exports.GetFood = GetFood;
//# sourceMappingURL=VendorController.js.map