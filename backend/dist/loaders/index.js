"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("./express"));
const mongoose_1 = __importDefault(require("./mongoose"));
const init = async ({ expressApp }) => {
    await (0, mongoose_1.default)();
    console.log('DB loaded and connected!');
    await (0, express_1.default)({ app: expressApp });
    console.log('Express App loaded!');
};
exports.default = { init };
