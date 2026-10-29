export class UpstreamError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'UpstreamError';
  }
}

export class UpstreamTimeoutError extends UpstreamError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'UpstreamTimeoutError';
  }
}
