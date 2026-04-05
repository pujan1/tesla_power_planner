"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_1 = __importDefault(require("./user.repository"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const createUser = async (userData) => {
    const { username, password, name } = userData;
    if (!username || !password || !name) {
        throw new ApiError_1.default(400, 'Username, password, and name are required');
    }
    const exists = await user_repository_1.default.checkUserExists(username);
    if (exists) {
        throw new ApiError_1.default(409, 'User already exists');
    }
    userData.language = 'en';
    userData.theme = 'dark';
    return user_repository_1.default.createUser(userData);
};
const getUserByUsername = async (username) => {
    const user = await user_repository_1.default.getUserByUsername(username);
    if (!user) {
        throw new ApiError_1.default(404, 'User not found');
    }
    return user;
};
const updateUser = async (username, updateData) => {
    const exists = await user_repository_1.default.checkUserExists(username);
    if (!exists) {
        throw new ApiError_1.default(404, 'User not found');
    }
    const payload = {};
    if (updateData.password !== undefined)
        payload.password = updateData.password;
    if (updateData.name !== undefined)
        payload.name = updateData.name;
    if (updateData.language !== undefined)
        payload.language = updateData.language;
    if (updateData.theme !== undefined)
        payload.theme = updateData.theme;
    return user_repository_1.default.updateUser(username, payload);
};
const loginUser = async (username, password) => {
    const user = await user_repository_1.default.getUserByUsername(username);
    if (!user) {
        throw new ApiError_1.default(401, 'Invalid username or password');
    }
    if (user.password !== password) {
        throw new ApiError_1.default(401, 'Invalid username or password');
    }
    return user;
};
const getAllUsers = async () => {
    return user_repository_1.default.getAllUsers();
};
exports.default = {
    createUser,
    getUserByUsername,
    updateUser,
    loginUser,
    getAllUsers
};
