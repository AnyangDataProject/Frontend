import { INQUIRY_TYPE_LABEL } from "../../api/enumMapping";

export const INQUIRY_TYPES = [
  { value: "report", label: INQUIRY_TYPE_LABEL.report, description: "접수한 신고에 대해 문의합니다." },
  { value: "result", label: INQUIRY_TYPE_LABEL.result, description: "처리 결과 또는 진행 상황을 문의합니다." },
  { value: "service", label: INQUIRY_TYPE_LABEL.service, description: "알로드 이용 방법을 문의합니다." },
  { value: "other", label: INQUIRY_TYPE_LABEL.other, description: "기타 의견이나 민원을 접수합니다." },
];
