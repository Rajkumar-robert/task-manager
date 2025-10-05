export interface StatusStat {
  _id: string;
  count: number;
}

export interface PriorityStat {
  _id: string;
  count: number;
}

export interface TaskStats {
  statusStats: StatusStat[];
  priorityStats: PriorityStat[];
}

export interface TrendData {
  month: number;
  count: number;
}
