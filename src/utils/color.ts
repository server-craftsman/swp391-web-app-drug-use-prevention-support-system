import { SurveyType } from "../app/enums/surveyType.enum";

export const getSurveyTypeColor = (type: SurveyType): string => {
    switch (type) {
        case SurveyType.RISK_ASSESSMENT:
            return "#f50"; // Red-orange for risk
        // case SurveyType.FEEDBACK:
        //     return "#1890ff"; // Blue for feedback
        case SurveyType.PRE_FEEDBACK:
            return "#52c41a"; // Green for pre-feedback
        case SurveyType.POST_FEEDBACK:
            return "#722ed1"; // Purple for post-feedback
        default:
            return "#8c8c8c"; // Gray for unknown
    }
};