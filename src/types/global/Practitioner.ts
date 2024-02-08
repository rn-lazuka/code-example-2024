export interface Practitioner {
  userId: number;
  name: string;
  specialities: { id: number; name: string }[];
  deleted: boolean;
}
