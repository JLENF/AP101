export class RentalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RentalError';
  }
}

export function handleRentalError(error: unknown): string {
  if (error instanceof RentalError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}