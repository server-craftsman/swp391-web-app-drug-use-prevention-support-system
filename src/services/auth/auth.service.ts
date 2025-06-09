import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import type { LoginRequest, RegisterRequest, ConfirmEmailRequest, RequestPasswordResetRequest, ResetPasswordRequest } from "../../types/user/User.req.type";
import type { UserResponse } from "../../types/user/User.res.type";
import { API_PATH } from "../../consts/api.path.const";

export const AuthService = {
  login(params: LoginRequest) {
    return BaseService.post<ResponseSuccess<UserResponse>>({
      url: API_PATH.AUTH.LOGIN,
      payload: params,
    });
  },
  register(params: RegisterRequest) {
    return BaseService.post<ResponseSuccess<UserResponse>>({
      url: API_PATH.AUTH.REGISTER,
      payload: params,
    });
  },
  confirmEmail(params: ConfirmEmailRequest) {
    return BaseService.get<ResponseSuccess<UserResponse>>({
      url: API_PATH.AUTH.CONFIRM_EMAIL,
      payload: params,
    });
  },
  requestPasswordReset(params: RequestPasswordResetRequest) {
    return BaseService.post<ResponseSuccess<UserResponse>>({
      url: API_PATH.AUTH.REQUEST_PASSWORD_RESET,
      payload: params,
    });
  },
  resetPassword(params: ResetPasswordRequest) {
    return BaseService.post<ResponseSuccess<UserResponse>>({
      url: API_PATH.AUTH.RESET_PASSWORD,
      payload: params,
    });
  },
}