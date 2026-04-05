"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("./user.model"));
const checkUserExists = async (username) => {
    const user = await user_model_1.default.findOne({ username });
    return !!user;
};
const createUser = async (userData) => {
    const newUser = await user_model_1.default.create(userData);
    return newUser.toJSON();
};
const getUserByUsername = async (username) => {
    const user = await user_model_1.default.findOne({ username });
    return user ? user.toJSON() : null;
};
const updateUser = async (username, updateData) => {
    const updatedUser = await user_model_1.default.findOneAndUpdate({ username }, { $set: updateData }, { new: true, runValidators: true });
    return updatedUser ? updatedUser.toJSON() : null;
};
const getAllUsers = async () => {
    const users = await user_model_1.default.find({});
    return users.map(user => user.toJSON());
};
exports.default = {
    checkUserExists,
    createUser,
    getUserByUsername,
    updateUser,
    getAllUsers,
};
