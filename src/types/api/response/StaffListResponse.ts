import { PaginationResponse, Speciality, StaffEntity } from '@types';

export interface StaffListContentItem extends Omit<StaffEntity, 'id' | 'name' | 'specialities'> {
  userId: number;
  userName: string;
  specialities: Speciality[];
}
export interface StaffListResponse extends PaginationResponse {
  content: StaffListContentItem[];
}
