import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../consts/router.path.const";
import { helpers } from "../utils";
import { ConsultantService } from "../services/consultant/consultant.service";
import type {
  CreateConsultantRequest,
  UpdateConsultantRequest,
} from "../types/consultant/consultant.req.type";

/**
 * Hook for use UpdateConsultant
 */
export const useUpdateConsultant = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: UpdateConsultantRequest) =>
      ConsultantService.updateConsultant(data),
    onSuccess: () => {
      helpers.notificationMessage("Consultant updated successfully", "success");
      navigate(ROUTER_URL.ADMIN.STAFF_CONSULTANTS);
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};

/**
 * Hook for use CreateConsultant
 */
export const useCreateConsultant = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: CreateConsultantRequest) =>
      ConsultantService.createConsultant(data),
    onSuccess: () => {
      helpers.notificationMessage("Consultant created successfully", "success");
      navigate(ROUTER_URL.ADMIN.STAFF_CONSULTANTS);
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};
