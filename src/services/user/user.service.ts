import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import type {
  GetUserByIdRequest,
  GetUsers,
  UpdateUserRequest,
  DeleteUserRequest,
  CreateUserRequest,
} from "../../types/user/User.req.type";
import type { UserResponse } from "../../types/user/User.res.type";
import { API_PATH } from "../../consts/api.path.const";

export const UserService = {
  getUserById(params: GetUserByIdRequest) {
    return BaseService.get<ResponseSuccess<UserResponse>>({
      url: API_PATH.USER.GET_USER_BY_ID(params.userId),
      payload: params,
    });
  },
  getAllUsers(params: GetUsers) {
    return BaseService.get<ResponseSuccess<UserResponse[]>>({
      url: API_PATH.USER.GET_USERS,
      payload: params,
    });
  },

  updateUser(params: UpdateUserRequest) {
    return BaseService.put<ResponseSuccess<UserResponse>>({
      url: API_PATH.USER.UPDATE_USER_PROFILE,
      payload: params,
    });
  },
  deleteUser(params: DeleteUserRequest) {
    return BaseService.remove<ResponseSuccess<void>>({
      url: API_PATH.USER.DELETE_USER(params.userId),
      payload: params,
    });
  },
  createUser(params: CreateUserRequest) {
    return BaseService.post<ResponseSuccess<UserResponse>>({
      url: API_PATH.USER.CREATE_USER,
      payload: params,
    });
  },
};
