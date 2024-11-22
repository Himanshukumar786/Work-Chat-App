import { StatusCodes } from "http-status-codes";
import { customErrorResponse, internalErrorResponse } from "../utils/common/responseObjects";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/userRepository";

export const isAuthinticated = async (req, res, next) => {
    
    try {
        const token = req.headers['x-access-token'];

        if (!token) {
            return res.status(StatusCodes.FORBIDDEN).json(
                customErrorResponse({
                    explanation: 'Invalid data sent from the client',
                    message: 'No token provided',
                })
            );
        }

        const response = jwt.verify(token, process.env.JWT_SECRET);

        if (!response) {
            return res.status(StatusCodes.FORBIDDEN).json(
                customErrorResponse({
                    explanation: 'Invalid data sent from the client',
                    message: 'Invalid auth token provided',
                })
            );
        }

        const user = await userRepository.getById(response.id);
        req.user = user.id;
        next();

    } catch (error) {
        console.log('Auth middleware error', error);
        if(error.name === 'jsonWebTokenError') {
            return res.status(StatusCodes.FORBIDDEN).json(
                customErrorResponse({
                    explanation: 'Invalid data sent from the client',
                    message: 'Invalid auth token provided',
                })
            );
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
            internalErrorResponse(error)
        )
    }
};
