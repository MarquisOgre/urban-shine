// Store-wide settings for the online shop.
export const STORE_NAME = "UltraShine";

// UPI details used to generate the payment QR code at checkout.
// Replace UPI_ID with your real UPI address to receive payments.
export const UPI_ID = "urbanshine@upi";
export const UPI_PAYEE_NAME = "UltraShine";

export const FREE_SHIPPING_ABOVE = 999;
export const SHIPPING_FEE = 60;

export const buildUpiLink = (amount: number, note: string) =>
  `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
    UPI_PAYEE_NAME
  )}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;
