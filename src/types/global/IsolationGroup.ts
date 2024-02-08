export interface IsolationGroup {
  id: number;
  isolations: string[];
  name: string;
}

export type IsolationGroupSummary = IsolationGroup & {
  locations: number;
};
