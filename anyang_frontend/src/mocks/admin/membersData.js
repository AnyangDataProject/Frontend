function mulberry32(seed) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(7042026);
const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;

const SURNAMES = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
const GIVEN = ['민준', '서연', '지훈', '도윤', '유리', '소율', '하은', '지우', '예준', '수아', '연우', '시우'];

function randomName(i) {
  const s = SURNAMES[i % SURNAMES.length];
  const g = GIVEN[(i * 3 + 1) % GIVEN.length];
  return `${s}${g}`;
}

function randomJoinDate() {
  const year = randInt(2024, 2026);
  const month = String(randInt(1, year === 2026 ? 9 : 12)).padStart(2, '0');
  const day = String(randInt(1, 28)).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const MEMBER_COUNT = 22;

export const MEMBERS = Array.from({ length: MEMBER_COUNT }, (_, i) => {
  const id = `U-${String(i + 1).padStart(4, '0')}`;
  const restricted = rand() < 0.14;
  return {
    id,
    name: randomName(i),
    email: `user${String(i + 1).padStart(3, '0')}@anyang-mail.kr`,
    joinedAt: randomJoinDate(),
    status: restricted ? 'restricted' : 'active',
    restrictionReason: restricted ? '허위 신고 누적으로 이용 제한' : null,
  };
});

export function getMembers() {
  return MEMBERS;
}

export function getMemberById(id) {
  return MEMBERS.find((m) => m.id === id) ?? null;
}
