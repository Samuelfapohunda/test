"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserInput = void 0;
const validateUserInput = (req, res, next) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({
            status: 'error',
            message: 'Email, password, and name are required',
        });
    }
    // Optional: basic format checks
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid email format',
        });
    }
    if (password.length < 6) {
        return res.status(400).json({
            status: 'error',
            message: 'Password must be at least 6 characters long',
        });
    }
    next();
};
exports.validateUserInput = validateUserInput;
