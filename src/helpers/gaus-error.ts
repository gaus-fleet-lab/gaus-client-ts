export class GausError extends Error {
  constructor(message: string) {
    super(message);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, GausError.prototype);
  }
}
