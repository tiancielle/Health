// src/middleware/errorHandler.js

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle Prisma errors
 */
const handlePrismaError = (error) => {
  let message = 'Database error';
  let statusCode = 500;

  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      const target = error.meta?.target;
      if (target && target.includes('email')) {
        message = 'Email address is already in use';
      } else {
        message = 'A record with this information already exists';
      }
      statusCode = 409;
      break;

    case 'P2025':
      // Record not found
      message = 'The requested resource was not found';
      statusCode = 404;
      break;

    case 'P2003':
      // Foreign key constraint violation
      message = 'Cannot delete or update due to existing references';
      statusCode = 400;
      break;

    case 'P2014':
      // Required relation is missing
      message = 'Required relation is missing';
      statusCode = 400;
      break;

    case 'P2021':
      // Table does not exist
      message = 'Database table does not exist';
      statusCode = 500;
      break;

    case 'P2022':
      // Column does not exist
      message = 'Database column does not exist';
      statusCode = 500;
      break;

    default:
      message = 'Database operation failed';
      statusCode = 500;
  }

  return new ApiError(message, statusCode);
};

/**
 * Handle JWT errors
 */
const handleJWTError = (error) => {
  let message = 'Authentication failed';
  let statusCode = 401;

  switch (error.name) {
    case 'JsonWebTokenError':
      message = 'Invalid token';
      break;
    case 'TokenExpiredError':
      message = 'Token has expired';
      break;
    case 'NotBeforeError':
      message = 'Token not active yet';
      break;
    default:
      message = 'Token validation failed';
  }

  return new ApiError(message, statusCode);
};

/**
 * Handle validation errors
 */
const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map(err => err.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new ApiError(message, 400);
};

/**
 * Handle cast errors (invalid ObjectId, UUID, etc.)
 */
const handleCastError = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new ApiError(message, 400);
};

/**
 * Send error response in development
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack,
    ...(err.errors && { errors: err.errors })
  });
};

/**
 * Send error response in production
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors })
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥:', err);
    
    res.status(500).json({
      success: false,
      message: 'Something went wrong on our end. Please try again later.'
    });
  }
};

/**
 * Main error handling middleware
 */
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;

  // Handle specific error types
  if (err.code && err.code.startsWith('P')) {
    // Prisma error
    error = handlePrismaError(err);
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError' || err.name === 'NotBeforeError') {
    // JWT error
    error = handleJWTError(err);
  } else if (err.name === 'ValidationError') {
    // Validation error
    error = handleValidationError(err);
  } else if (err.name === 'CastError') {
    // Cast error
    error = handleCastError(err);
  }

  // Log error
  console.error(`${req.method} ${req.path} - ${error.statusCode} - ${error.message}`);
  
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

/**
 * Catch async errors wrapper
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Handle unhandled routes (404)
 */
const handleNotFound = (req, res, next) => {
  const message = `Cannot find ${req.originalUrl} on this server!`;
  const err = new ApiError(message, 404);
  next(err);
};

/**
 * Rate limiting error handler
 */
const handleRateLimitError = (req, res) => {
  return res.status(429).json({
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.round(req.rateLimit?.resetTime / 1000) || 900
  });
};

module.exports = {
  ApiError,
  globalErrorHandler,
  catchAsync,
  handleNotFound,
  handleRateLimitError,
  handlePrismaError,
  handleJWTError
};