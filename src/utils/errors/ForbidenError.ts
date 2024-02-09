class ForbiddenError extends Error {
  statusCode: number;

  constructor(message:any) {
    super(message);
    this.statusCode = 403;
  }
}

export default module.exports = ForbiddenError;
