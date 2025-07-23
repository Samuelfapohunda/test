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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserBlacklist = void 0;
const axios_1 = __importDefault(require("axios"));
const checkUserBlacklist = (email) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const response = yield axios_1.default.get(`https://api.karma.lendsqr.com/api/v1/blacklist`, {
            params: { email },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // 'Authorization': `Bearer YOUR_API_KEY` // ← if API key is needed
            },
        });
        return ((_a = response.data) === null || _a === void 0 ? void 0 : _a.isBlacklisted) || false;
    }
    catch (error) {
        console.error('❌ Karma API Error:', ((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message);
        throw new Error('Failed to verify blacklist status');
    }
});
exports.checkUserBlacklist = checkUserBlacklist;
