import type { PaymentMethod } from "../../app/enums/paymentMethod.enum";

export interface PaymentRequest {
  orderId: string;
  userId: string;
  amount: number;
  paymentMethod: PaymentMethod;
}
