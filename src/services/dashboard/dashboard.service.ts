import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import { API_PATH } from "../../consts/api.path.const";
import type { DashboardOverallRequest } from "../../types/dashboard/Dashboard.req.type";
import type { DashboardOverallResponse } from "../../types/dashboard/Dashboard.res.type";

export const DashboardService = {
  getDashboardOverall(params: DashboardOverallRequest) {
    return BaseService.get<ResponseSuccess<DashboardOverallResponse>>({
      url: API_PATH.DASHBOARD.GET_DASHBOARD_OVERALL,
      payload: params,
    });
  },
};
