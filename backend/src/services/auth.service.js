import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export const registerUser = async (username, email, password) => {
    try {
        const user = await User.create({ username, email, password });
        return user;
    } catch (error) {
        if (error.code === 11000) {
            throw new ApiError(400, 'Username or email already exists');
        }
        throw new ApiError(500, error.message);
    }
};

export const loginUser = async (email, password) => {
    if (!email || !password) {
        throw new ApiError(400, "Please provide an email and password");
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }

    return user;
};

export const getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return user;
};
