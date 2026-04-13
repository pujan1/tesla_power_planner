"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("../api/users/user.routes"));
const _1 = __importDefault(require("../middlewares/errorHandler"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
exports.default = async ({ app }) => {
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use('/api', user_routes_1.default);
    app.use((req, res, next) => {
        next(new ApiError_1.default(404, 'Not Found'));
    });
    app.use(errorHandler_1.default);
    return app;
};
