import express from 'express';
import {
  createWallet,
  fundWallet,
  transferWallet,
  withdrawFunds
} from '../controllers/walletController';

const router = express.Router();

router.post('/wallet/create', createWallet);
router.post('/wallet/fund', fundWallet);
router.post('/wallet/transfer', transferWallet);
router.post('/wallet/withdraw', withdrawFunds);

export default router;
