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
exports.withdrawFunds = exports.transferWallet = exports.fundWallet = exports.createWallet = void 0;
const db_1 = __importDefault(require("../db"));
const axios_1 = __importDefault(require("axios"));
const createWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, currency } = req.body;
    try {
        const wallet = {
            user_id,
            balance: 0,
            currency: currency || 'NGN',
        };
        const [createdWallet] = yield (0, db_1.default)('wallets').insert(wallet).returning('*');
        console.log("🎉 Wallet created:", createdWallet);
        res.status(201).json({ success: true, wallet: createdWallet });
    }
    catch (err) {
        console.error("❌ Error creating wallet:", err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.createWallet = createWallet;
const fundWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, amount } = req.body;
    try {
        if (!user_id || !amount) {
            return res.status(400).json({ success: false, message: 'user_id and amount are required' });
        }
        const wallet = yield (0, db_1.default)('wallets').where({ user_id }).first();
        if (!wallet) {
            return res.status(404).json({ success: false, message: 'Wallet not found' });
        }
        const newBalance = Number(wallet.balance) + Number(amount);
        const [updatedWallet] = yield (0, db_1.default)('wallets')
            .where({ user_id })
            .update({ balance: newBalance })
            .returning('*');
        console.log("💰 Wallet funded:", updatedWallet);
        res.status(200).json({ success: true, wallet: updatedWallet });
    }
    catch (err) {
        console.error("❌ Error funding wallet:", err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.fundWallet = fundWallet;
const transferWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { sender_id, receiver_id, amount } = req.body;
    if (!sender_id || !receiver_id || !amount) {
        return res.status(400).json({ success: false, message: 'sender_id, receiver_id, and amount are required' });
    }
    try {
        const karmaUrl = `https://sandbox-api-d.karma.redcheck.xyz/api/v1/third-party/blacklist/check`;
        const karmaToken = process.env.KARMA_API_KEY;
        const blacklistCheck = yield axios_1.default.post(karmaUrl, { user_ids: [sender_id, receiver_id] }, { headers: { Authorization: `Bearer ${karmaToken}` } });
        const blacklisted = (_b = (_a = blacklistCheck.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.filter((entry) => entry.is_blacklisted);
        if (blacklisted.length > 0) {
            return res.status(403).json({
                success: false,
                message: 'One or more users are blacklisted from performing transactions.',
                details: blacklisted
            });
        }
        const senderWallet = yield (0, db_1.default)('wallets').where({ user_id: sender_id }).first();
        const receiverWallet = yield (0, db_1.default)('wallets').where({ user_id: receiver_id }).first();
        if (!senderWallet || !receiverWallet) {
            return res.status(404).json({ success: false, message: 'Sender or receiver wallet not found' });
        }
        if (Number(senderWallet.balance) < Number(amount)) {
            return res.status(400).json({ success: false, message: 'Insufficient balance' });
        }
        yield db_1.default.transaction((trx) => __awaiter(void 0, void 0, void 0, function* () {
            yield trx('wallets')
                .where({ user_id: sender_id })
                .update({ balance: Number(senderWallet.balance) - Number(amount) });
            yield trx('wallets')
                .where({ user_id: receiver_id })
                .update({ balance: Number(receiverWallet.balance) + Number(amount) });
        }));
        console.log(`🔁 Transferred ₦${amount} from ${sender_id} to ${receiver_id}`);
        res.status(200).json({ success: true, message: 'Transfer successful' });
    }
    catch (err) {
        console.error("❌ Error transferring funds:", err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.transferWallet = transferWallet;
const withdrawFunds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, amount } = req.body;
    try {
        if (!user_id || !amount) {
            return res.status(400).json({ success: false, message: 'user_id and amount are required' });
        }
        const wallet = yield (0, db_1.default)('wallets').where({ user_id }).first();
        if (!wallet) {
            return res.status(404).json({ success: false, message: 'Wallet not found' });
        }
        if (Number(wallet.balance) < Number(amount)) {
            return res.status(400).json({ success: false, message: 'Insufficient balance' });
        }
        const newBalance = Number(wallet.balance) - Number(amount);
        const [updatedWallet] = yield (0, db_1.default)('wallets')
            .where({ user_id })
            .update({ balance: newBalance })
            .returning('*');
        console.log(`💸 Withdrawn ₦${amount} by ${user_id}`);
        res.status(200).json({ success: true, wallet: updatedWallet });
    }
    catch (err) {
        console.error("❌ Error withdrawing funds:", err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.withdrawFunds = withdrawFunds;
