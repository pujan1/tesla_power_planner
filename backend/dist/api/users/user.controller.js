"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const user_service_1 = __importDefault(require("./user.service"));
const createUser = (0, catchAsync_1.default)(async (req, res) => {
    const user = await user_service_1.default.createUser(req.body);
    res.status(201).json({ message: 'User created successfully', user });
});
const getUser = (0, catchAsync_1.default)(async (req, res) => {
    const user = await user_service_1.default.getUserByUsername(req.params.username);
    res.json({ user });
});
const updateUser = (0, catchAsync_1.default)(async (req, res) => {
    const user = await user_service_1.default.updateUser(req.params.username, req.body);
    res.json({ message: 'User updated successfully', user });
});
const login = (0, catchAsync_1.default)(async (req, res) => {
    const user = await user_service_1.default.loginUser(req.body.username, req.body.password);
    res.json({ message: 'Login successful', user });
});
const getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
    const users = await user_service_1.default.getAllUsers();
    res.json({ count: users.length, users });
});
exports.default = {
    createUser,
    getUser,
    updateUser,
    login,
    getAllUsers
};
