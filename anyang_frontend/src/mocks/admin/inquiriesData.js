// 문의 관리 목데이터. reportId는 reportsData.js에 실제로 존재하는 신고번호를 참조해
// "신고 보기" 버튼을 눌렀을 때 /admin/reports/:id 상세 페이지로 정상 이동하게 한다.
export const INQUIRIES = [
  {
    id: 1,
    type: 'report',
    title: '신고한 포트홀 처리가 언제 완료되나요?',
    content:
      '9월 8일에 평촌대로 123에 있는 포트홀을 신고했습니다. 현재 접수 대기 상태로 확인되는데 언제쯤 처리될 예정인지 궁금합니다.',
    reporter: '김민준',
    email: 'minjun@example.com',
    createdAt: '2026-09-09 09:32',
    status: 'waiting',
    reportId: '10001',
    answer: '',
  },
  {
    id: 2,
    type: 'result',
    title: '처리 완료된 신고에 대한 문의입니다.',
    content:
      '제가 신고한 도로 균열이 처리 완료되었다고 나오는데 실제 현장에서는 아직 균열이 보입니다. 다시 확인해주실 수 있을까요?',
    reporter: '이서연',
    email: 'seoyeon@example.com',
    createdAt: '2026-09-08 16:21',
    status: 'waiting',
    reportId: '10002',
    answer: '',
  },
  {
    id: 3,
    type: 'service',
    title: '신고 사진 업로드가 되지 않습니다.',
    content:
      '파손 신고를 하려고 사진을 업로드했는데 계속 업로드 오류가 발생합니다. 휴대폰에서도 동일한 문제가 발생합니다.',
    reporter: '박지훈',
    email: 'jihoon@example.com',
    createdAt: '2026-09-08 14:08',
    status: 'answered',
    reportId: null,
    answer:
      '이용에 불편을 드려 죄송합니다. 사진 파일의 용량이 10MB를 초과하는 경우 업로드가 제한될 수 있습니다. 파일 용량을 확인하신 후 다시 시도해주시기 바랍니다.',
  },
  {
    id: 4,
    type: 'other',
    title: '도로 파손 신고 위치를 수정하고 싶습니다.',
    content:
      '신고 과정에서 지도 위치를 잘못 선택했습니다. 이미 접수된 신고의 위치를 수정할 수 있는지 문의드립니다.',
    reporter: '최유리',
    email: 'yuri@example.com',
    createdAt: '2026-09-07 11:45',
    status: 'waiting',
    reportId: '10005',
    answer: '',
  },
  {
    id: 5,
    type: 'report',
    title: '신고가 정상적으로 접수되었는지 확인해주세요.',
    content:
      '어제 도로 파손 신고를 제출했는데 내 신고현황에서 확인되지 않습니다. 정상적으로 접수된 것이 맞는지 확인 부탁드립니다.',
    reporter: '정도윤',
    email: 'doyoon@example.com',
    createdAt: '2026-09-06 17:12',
    status: 'answered',
    reportId: '10004',
    answer: '확인 결과 정상적으로 접수되었습니다. 현재 담당 부서에서 현장 확인 및 처리를 진행하고 있습니다.',
  },
  {
    id: 6,
    type: 'result',
    title: '도로 보수 후에도 문제가 남아 있습니다.',
    content:
      '처리 완료로 표시되어 있는데 해당 구간을 지나갈 때 여전히 차량에 충격이 있습니다. 추가 점검을 요청드립니다.',
    reporter: '한소율',
    email: 'ssoyl@example.com',
    createdAt: '2026-09-06 10:03',
    status: 'waiting',
    reportId: '10006',
    answer: '',
  },
  {
    id: 7,
    type: 'service',
    title: '회원가입 시 인증번호가 오지 않습니다.',
    content:
      '회원가입을 진행하면서 이메일 인증번호를 요청했지만 메일이 도착하지 않습니다. 스팸메일함도 확인했습니다.',
    reporter: '오준서',
    email: 'junseo@example.com',
    createdAt: '2026-09-05 15:28',
    status: 'answered',
    reportId: null,
    answer: '메일 서버 상황에 따라 인증 메일이 늦게 도착할 수 있습니다. 잠시 후 다시 인증번호를 요청해주시기 바랍니다.',
  },
  {
    id: 8,
    type: 'other',
    title: '특정 도로의 반복적인 파손이 궁금합니다.',
    content:
      '같은 도로에서 계속해서 포트홀이 발생하고 있는 것 같습니다. 근본적인 보수 계획이 있는지 궁금합니다.',
    reporter: '임하은',
    email: 'haeun@example.com',
    createdAt: '2026-09-04 13:17',
    status: 'waiting',
    reportId: '10231',
    answer: '',
  },
];

export function getInquiries() {
  return INQUIRIES;
}
