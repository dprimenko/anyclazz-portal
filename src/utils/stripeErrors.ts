export function getStripeErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred.';

  if (error.type === 'card_error') {
    switch (error.code) {
      case 'card_declined':
        return 'Your card was declined. Please try a different payment method.';
      case 'expired_card':
        return 'Your card has expired. Please use a different card.';
      case 'incorrect_cvc':
        return 'The CVC code is incorrect. Please check and try again.';
      case 'processing_error':
        return 'An error occurred while processing your card. Please try again.';
      case 'insufficient_funds':
        return 'Your card has insufficient funds.';
      default:
        return error.message || 'Your card was declined.';
    }
  }

  if (error.type === 'validation_error') {
    return 'Please check your card details and try again.';
  }

  return error.message || 'An unexpected error occurred.';
}
