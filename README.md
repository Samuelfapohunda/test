Lendsqr Wallet API

A simple wallet service built with **Node.js**, **TypeScript**, **KnexJS**, and **MySQL** as part of the Lendsqr Backend Engineering Assessment.

Features

- ✅ User registration with blacklist check (via Karma API)
- ✅ Wallet creation upon user registration
- ✅ Fund wallet
- ✅ Transfer funds between wallets
- ✅ Withdraw from wallet
- ✅ Transaction logging
- ✅ Blacklist log tracking
- ✅ RESTful API with proper status codes and validation

Technologies Used

- Node.js
- Express
- TypeScript
- MySQL
- KnexJS (SQL query builder)
- Karma API (Adjutor blacklist service)
- Docker
- Railway (for deployment)

---

 Entity Relationship Diagram (ERD)

![ERD Diagram](./erd.png)

### Tables

- **users**: Stores user info and blacklist status
- **wallets**: Each user has one wallet
- **transactions**: Logs transfers and withdrawals
- **blacklist_logs**: Tracks blacklist check results

---

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Gbeminiyigbenga/lendsqr-wallet.git
cd lendsqr-wallet
