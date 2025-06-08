export interface Program {
  id: number;
  name: string;
  description: string;
  location: string;
  type: "FULL_TIME" | "PART_TIME" | "CONTRACT";
  startDate: string;
  endDate: string;
  programImgUrl: string;
}
