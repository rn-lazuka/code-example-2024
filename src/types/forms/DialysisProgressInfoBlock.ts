import type { DialysisProcessInfoRequest } from '@types';

export type DialysisProcessInfoForProgress = Pick<
  DialysisProcessInfoRequest,
  'status' | 'startTime' | 'endTime' | 'bay'
>;

export type StandardDialysisInfoBlockProps = {
  withInfoIcon?: boolean;
  checkInfoHandler?: () => void;
  progressInPercents: number;
  progressLabel: string;
  dialysisProcessInfo: DialysisProcessInfoForProgress;
};

export type TableVariantDialysisInfoBlockProps = Omit<
  StandardDialysisInfoBlockProps,
  'withInfoIcon' | 'checkInfoHandler'
>;
