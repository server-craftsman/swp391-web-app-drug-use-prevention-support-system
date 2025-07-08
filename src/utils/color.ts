import { SurveyType } from "../app/enums/surveyType.enum";

export const getSurveyTypeColor = (type: SurveyType): string => {
    switch (type) {
        case SurveyType.RISK_ASSESSMENT:
            return "#f50"; // Red-orange for risk
        case SurveyType.FEEDBACK:
            return "#1890ff"; // Blue for feedback
        default:
            return "#8c8c8c"; // Gray for unknown
    }
};