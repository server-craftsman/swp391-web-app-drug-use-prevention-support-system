import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import type { PaymentRequest } from "../../types/payment/Payment.req.type";
import type { PaymentResponse } from "../../types/payment/Payment.res.type";
import { API_PATH } from "../../consts/api.path.const";

export const PaymentService = {
  createPayment(params: PaymentRequest) {
    return BaseService.post<ResponseSuccess<PaymentResponse>>({
      url: API_PATH.PAYMENT.CREATE_PAYMENT,
      payload: params,
    });
  },
};
