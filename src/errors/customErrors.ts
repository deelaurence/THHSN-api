import { StatusCodes } from 'http-status-codes';

const capitalize=(content:string):string =>{
  return String(content).charAt(0).toUpperCase()+String(content).slice(1)
}

class BaseError extends Error{
  public statusCode: number;
  public status: string;
  public code: string;
  public reason: string;

  constructor(
    message:string,
    statusCode: number,
    status: string,
    code: string,
    reason: string,
  ){
    super(message);
    this.status = status;
    this.statusCode = statusCode;
    this.code = code;
    this.reason = capitalize(reason);
  }
}


// Specific error classes extending the base class
class BadRequest extends BaseError {
  constructor(
    message: string = 'Bad Request',
    status: string = 'error',
    code: string = 'BAD_REQUEST',
    reason: string = message
  ) {
    super(message, StatusCodes.BAD_REQUEST, code, status, reason);
  }
}

class NotFound extends BaseError {
  constructor(
    message: string = 'Not Found',
    status: string = 'error',
    code: string = 'NOT_FOUND',
    reason: string = message
  ) {
    super(message, StatusCodes.NOT_FOUND, code, status, reason);
  }
}

class Unauthenticated extends BaseError {
  constructor(
    message: string = 'Unauthorized',
    status: string = 'error',
    code: string = 'UNAUTHORIZED',
    reason: string = message
  ) {
    super(message, StatusCodes.UNAUTHORIZED, code, status, reason);
  }
}

class InternalServerError extends BaseError {
  constructor(
    message: string = 'Internal Server Error',
    status: string = 'error',
    code: string = 'INTERNAL_SERVER_ERROR',
    reason: string = message
  ) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, code, status, reason);
  }
}

class Conflict extends BaseError {
  constructor(
    message: string = 'Conflict',
    status: string = 'error',
    code: string = 'CONFLICT',
    reason: string = message
  ) {
    super(message, StatusCodes.CONFLICT, code, status, reason);
  }
}
export { Unauthenticated, InternalServerError, Conflict, BadRequest, NotFound };

