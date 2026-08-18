export type HistoryGroup = {
  date: string;
  workouts: {
    id: string;
    name: string;
    detail: string;
    duration: string;
  }[];
};

export const referenceHistory: HistoryGroup[] = [];
