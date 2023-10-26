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
exports.UpdateCustomerProfile = exports.GetCustomerProfile = exports.RequestOtp = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSingUp = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const Customer_dto_1 = require("../dto/Customer.dto");
const utility_1 = require("../utility");
const models_1 = require("../models");
const CustomerSingUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.CreateCustomerInput, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, phone, password } = customerInputs;
    const exitsingCustomer = yield models_1.Customer.findOne({ email: email });
    if (exitsingCustomer) {
        return res.status(400).json({ "message": "An user already exits with this email" });
    }
    const salt = yield (0, utility_1.GenerateSalt)();
    const userPassowrd = yield (0, utility_1.GeneratePassword)(password, salt);
    const { otp, expiry } = yield (0, utility_1.GenerateOtp)();
    const result = yield models_1.Customer.create({
        firstName: '',
        lastName: '',
        email,
        phone,
        password: userPassowrd,
        salt,
        address: '',
        lat: 0,
        lng: 0,
        verified: false,
        otp,
        otp_expiry: expiry
    });
    if (result) {
        // send otp
        // await onRequestOtp(otp,phone)
        // generate token
        const token = yield (0, utility_1.GenerateToken)({
            _id: result.id,
            email: result.email,
            verified: result.verified
        });
        // return result
        return res.status(200).json({ email: result.email, verified: result.verified, token });
    }
    return res.status(500).json({ "message": "something went wrong" });
});
exports.CustomerSingUp = CustomerSingUp;
const CustomerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.CustomerLoginInput, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(loginInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, password } = loginInputs;
    const result = yield models_1.Customer.findOne({ email: email });
    if (result) {
        const verifyPassword = yield (0, utility_1.ValidatePassword)(password, result.password, result.salt);
        if (verifyPassword) {
            const token = yield (0, utility_1.GenerateToken)({
                _id: result.id,
                email: result.email,
                verified: result.verified
            });
            return res.status(200).json({ email: result.email, verified: result.verified, token });
        }
        else {
            return res.status(400).json({ "message": "invalid email" });
        }
    }
    else {
        return res.status(400).json({ "message": "invalid password" });
    }
});
exports.CustomerLogin = CustomerLogin;
const CustomerVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const user = req.user;
    const customer = yield models_1.Customer.findById(user._id);
    if (customer) {
        console.log('new Date()', new Date());
        if (customer.otp === parseInt(otp) && customer.otp_expiry >= new Date()) {
            customer.verified = true;
            const updatedCustomer = yield customer.save();
            // generate token
            const token = yield (0, utility_1.GenerateToken)({
                _id: updatedCustomer.id,
                email: updatedCustomer.email,
                verified: updatedCustomer.verified
            });
            return res.status(200).json({ email: updatedCustomer.email, verified: updatedCustomer.verified, token });
        }
        else {
            return res.status(400).json({ 'message': "invalid otp" });
        }
    }
    else {
        return res.status(400).json({ 'message': "customer not found" });
    }
});
exports.CustomerVerify = CustomerVerify;
const RequestOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const customer = yield models_1.Customer.findById(user._id);
    if (customer) {
        // generate otp
        const { otp, expiry } = yield (0, utility_1.GenerateOtp)();
        customer.otp = otp;
        customer.otp_expiry = expiry;
        yield customer.save();
        // send otp
        // await onRequestOtp(otp,customer.phone)
        return res.status(200).json({ "message": "otp has send to registed number" });
    }
});
exports.RequestOtp = RequestOtp;
const GetCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const customer = yield models_1.Customer.findById(user._id);
    return res.status(200).json(customer);
});
exports.GetCustomerProfile = GetCustomerProfile;
const UpdateCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const customerInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.UpdateCustomerInput, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const customer = yield models_1.Customer.findById(user._id);
    if (customer) {
        const { firstName, lastName, address } = req.body;
        customer.firstName = firstName;
        customer.lastName = lastName;
        customer.address = address;
        const result = yield customer.save();
        return res.status(200).json(result);
    }
    else {
        return res.status(400).json({ 'message': "customer not found" });
    }
});
exports.UpdateCustomerProfile = UpdateCustomerProfile;
//# sourceMappingURL=CustomerController.js.map