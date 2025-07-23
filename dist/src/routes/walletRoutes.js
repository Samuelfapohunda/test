"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const walletController_1 = require("../controllers/walletController");
const router = express_1.default.Router();
router.post('/wallet/create', walletController_1.createWallet);
router.post('/wallet/fund', walletController_1.fundWallet);
router.post('/wallet/transfer', walletController_1.transferWallet);
router.post('/wallet/withdraw', walletController_1.withdrawFunds);
exports.default = router;
