import { Request, Response } from 'express';
import knex from '../db';
import axios from 'axios';

export const createWallet = async (req: Request, res: Response) => {
  const { user_id, currency } = req.body;

  try {
    const wallet = {
      user_id,
      balance: 0,
      currency: currency || 'NGN',
    };

    const [createdWallet] = await knex('wallets').insert(wallet).returning('*');

    console.log("🎉 Wallet created:", createdWallet);
    res.status(201).json({ success: true, wallet: createdWallet });
  } catch (err) {
    console.error("❌ Error creating wallet:", err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const fundWallet = async (req: Request, res: Response) => {
  const { user_id, amount } = req.body;

  try {
    if (!user_id || !amount) {
      return res.status(400).json({ success: false, message: 'user_id and amount are required' });
    }

    const wallet = await knex('wallets').where({ user_id }).first();

    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }

    const newBalance = Number(wallet.balance) + Number(amount);

    const [updatedWallet] = await knex('wallets')
      .where({ user_id })
      .update({ balance: newBalance })
      .returning('*');

    console.log("💰 Wallet funded:", updatedWallet);
    res.status(200).json({ success: true, wallet: updatedWallet });
  } catch (err) {
    console.error("❌ Error funding wallet:", err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const transferWallet = async (req: Request, res: Response) => {
  const { sender_id, receiver_id, amount } = req.body;

  if (!sender_id || !receiver_id || !amount) {
    return res.status(400).json({ success: false, message: 'sender_id, receiver_id, and amount are required' });
  }

  try {
    const karmaUrl = `https://sandbox-api-d.karma.redcheck.xyz/api/v1/third-party/blacklist/check`;
    const karmaToken = process.env.KARMA_API_KEY;

    const blacklistCheck = await axios.post(
      karmaUrl,
      { user_ids: [sender_id, receiver_id] },
      { headers: { Authorization: `Bearer ${karmaToken}` } }
    );

    const blacklisted = blacklistCheck.data?.data?.filter((entry: any) => entry.is_blacklisted);
    if (blacklisted.length > 0) {
      return res.status(403).json({
        success: false,
        message: 'One or more users are blacklisted from performing transactions.',
        details: blacklisted
      });
    }

    const senderWallet = await knex('wallets').where({ user_id: sender_id }).first();
    const receiverWallet = await knex('wallets').where({ user_id: receiver_id }).first();

    if (!senderWallet || !receiverWallet) {
      return res.status(404).json({ success: false, message: 'Sender or receiver wallet not found' });
    }

    if (Number(senderWallet.balance) < Number(amount)) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    await knex.transaction(async (trx) => {
      await trx('wallets')
        .where({ user_id: sender_id })
        .update({ balance: Number(senderWallet.balance) - Number(amount) });

      await trx('wallets')
        .where({ user_id: receiver_id })
        .update({ balance: Number(receiverWallet.balance) + Number(amount) });
    });

    console.log(`🔁 Transferred ₦${amount} from ${sender_id} to ${receiver_id}`);
    res.status(200).json({ success: true, message: 'Transfer successful' });

  } catch (err) {
    console.error("❌ Error transferring funds:", err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const withdrawFunds = async (req: Request, res: Response) => {
  const { user_id, amount } = req.body;

  try {
    if (!user_id || !amount) {
      return res.status(400).json({ success: false, message: 'user_id and amount are required' });
    }

    const wallet = await knex('wallets').where({ user_id }).first();

    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }

    if (Number(wallet.balance) < Number(amount)) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    const newBalance = Number(wallet.balance) - Number(amount);

    const [updatedWallet] = await knex('wallets')
      .where({ user_id })
      .update({ balance: newBalance })
      .returning('*');

    console.log(`💸 Withdrawn ₦${amount} by ${user_id}`);
    res.status(200).json({ success: true, wallet: updatedWallet });

  } catch (err) {
    console.error("❌ Error withdrawing funds:", err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
