import { useMutation } from "@tanstack/react-query";
import { AppointmentService } from "../services/appointment/appointment.service";
import { useNavigate } from "react-router-dom";
import type { CreateAppointmentRequest } from "../types/appointment/Appointment.req.type";
import { ROUTER_URL } from "../consts/router.path.const";
import { helpers } from "../utils";

/**
 * Hook for appointment createAppointment
 */
export const useCreateAppointment = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateAppointmentRequest) =>
      AppointmentService.createAppointment(data),
    onSuccess: () => {
      helpers.notificationMessage("Đặt lịch thành công", "success");
      navigate(ROUTER_URL.CLIENT.COUNSEL);
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};
