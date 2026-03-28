import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as authService from '../services/auth.service.js';

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json(
    new ApiResponse(statusCode, {
        token,
        user: { id: user._id, username: user.username, email: user.email }
    }, "Success")
  );
};

export const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    const user = await authService.registerUser(username, email, password);
    sendTokenResponse(user, 201, res);
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    sendTokenResponse(user, 200, res);
});

export const getMe = asyncHandler(async (req, res) => {
    const user = await authService.getUserById(req.user.id);
    res.status(200).json(
        new ApiResponse(200, {
            id: user._id, username: user.username, email: user.email
        }, "User fetched successfully")
    );
});
