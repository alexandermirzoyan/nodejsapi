import { HttpStatus } from '../constants/httpStatus.js';

class Response {
  constructor(statusCode, httpStatus, message, data) {
    this.timeStamp = new Date().toLocaleString();
    this.statusCode = statusCode;
    this.httpStatus = httpStatus;
    this.message = message;
    this.data = data;
  }

  static generateResponseSchema(type, message, data) {
    return {
      timeStamp: new Date().toLocaleString(),
      statusCode: HttpStatus[type].code,
      httpStatus: HttpStatus[type].status,
      message: message,
      data: data,
    }
  }

  static Ok(message, data) {
    return this.generateResponseSchema('OK', message, data);
  }

  static NotFound(message, data) {
    return this.generateResponseSchema('NOT_FOUND', message, data);
  }

  static InternalServerError(message, data) {
    return this.generateResponseSchema('INTERNAL_SERVER_ERROR', message, data);
  }
  
  static Created(message, data) {
    return this.generateResponseSchema('CREATED', message, data);
  }
}

export default Response;
