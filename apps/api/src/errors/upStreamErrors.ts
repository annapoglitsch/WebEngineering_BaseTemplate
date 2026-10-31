export interface ProblemFieldError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly title: string,
    public readonly errors?: ProblemFieldError[],
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = new.target.name;
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string, errors: ProblemFieldError[] = []) {
    super(message, 400, 'Bad Request', errors);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, 404, 'Not Found');
  }
}

export class UpstreamError extends ApiError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 502, 'Bad Gateway', undefined, options);
  }
}

export class UpstreamTimeoutError extends ApiError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 504, 'Gateway Timeout', undefined, options);
  }
}
