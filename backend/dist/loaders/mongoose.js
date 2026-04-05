"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
const init = async () => {
    if (!config_1.default.databaseURL) {
        console.warn('⚠️ No MONGODB_URI found. The database connection was skipped.');
        return;
    }
    try {
        const connection = await mongoose_1.default.connect(config_1.default.databaseURL);
        return connection.connection.db;
    }
    catch (error) {
        console.error('❌ MongoDB Connection Error: ', error);
        process.exit(1);
    }
};
exports.default = init;
