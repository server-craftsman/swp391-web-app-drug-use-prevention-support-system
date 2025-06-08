import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import type { UserResponse } from "../../types/user/User.res.type";
import { API_PATH } from "../../consts/api.path.const";

export const AuthService = {
    login(params: { email: string; password: string }) {
        return BaseService.post<ResponseSuccess<UserResponse>>({
          url: API_PATH.AUTH.LOGIN,
          payload: params,
          isLoading: true
        });
      },
}