export type OrganizationType = '인수위원단' | '특별위원단' | '자문위원단';

export type DepartmentType =
  | '기획자치분과'
  | '미래경제분과'
  | '도시교통환경분과'
  | '복지문화교육분과'
  | '재정혁신특위'
  | '공동주택 관리비 특위'
  | '해당없음';

export type PositionType =
  | '위원장'
  | '부위원장'
  | '위원'
  | '자문위원'
  | '총괄간사';

export interface Member {
  id: string;
  organization: OrganizationType;
  department: DepartmentType;
  position: PositionType;
  name: string;
  careers: string[];
}
