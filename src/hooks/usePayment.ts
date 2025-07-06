import { useMutation } from "@tanstack/react-query";
import { PaymentService } from "../services/payment/payment.service";
import type { PaymentRequest } from "../types/payment/Payment.req.type";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../consts/router.path.const";
import { helpers } from "../utils";

/**
 * Hook for createPayment
 */
export const useCreatePayment = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: PaymentRequest) => PaymentService.createPayment(data),
    onSuccess: () => {
      helpers.notificationMessage("Payment created successfully", "success");
      navigate(ROUTER_URL.CLIENT.COURSE);
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};
