"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("./user.controller"));
const router = (0, express_1.Router)();
router.get('/users', user_controller_1.default.getAllUsers);
router.post('/users', user_controller_1.default.createUser);
router.get('/users/:username', user_controller_1.default.getUser);
router.put('/users/:username', user_controller_1.default.updateUser);
router.post('/login', user_controller_1.default.login);
exports.default = router;
