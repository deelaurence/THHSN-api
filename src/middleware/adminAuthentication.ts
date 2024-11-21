import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { configDotenv } from 'dotenv';
import { Unauthenticated } from '../errors/customErrors';
import { Request, Response, NextFunction } from 'express';

// Load environment variables
configDotenv();

// Extend Express's Request interface to include the decoded token
declare module 'express' {
  interface Request {
    decoded?: JwtPayload;
  }
}

const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('admin auth start');
    let token: string | null = null;

    // Check for token in headers
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith('Bearer ')) {
      token = authorization.split(' ')[1];
    }

    // If no token is provided
    if (!token) {
      throw new Unauthenticated('Token not provided');
    }

    // Verify the token
    const payload = jwt.verify(token, process.env.JWT_SECRET as Secret) as JwtPayload;

    // Attach decoded payload to the request object
    req.decoded = { name: payload.name, id: payload.id };

    console.log('admin auth end, next');
    next();
  } catch (error: any) {
    console.log('auth error:', error);

    // Handle JWT-specific errors like TokenExpiredError or JsonWebTokenError
    if (error.name === 'TokenExpiredError') {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new Unauthenticated('Token has expired'));
    } else if (error.name === 'JsonWebTokenError') {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(new Unauthenticated('Invalid token'));
    }

    // If the error has a custom statusCode, use it; otherwise, default to 401
    const statusCode = error.statusCode || StatusCodes.UNAUTHORIZED;
    const message = error.message || 'Authentication failed';

    return res.status(statusCode).json(new Unauthenticated(message));
  }
};

export default adminAuth;
