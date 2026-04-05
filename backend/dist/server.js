"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
const loaders_1 = __importDefault(require("./loaders"));
async function startServer() {
    const app = (0, express_1.default)();
    await loaders_1.default.init({ expressApp: app });
    app.listen(config_1.default.port, () => {
        console.log(`Backend server running on http://localhost:${config_1.default.port}`);
    });
}
startServer();
