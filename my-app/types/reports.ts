export type ReportStatus = "open" | "in_review" | "resolved" | "dismissed";

export type ReportTargetType = "review" | "user" | "comment" | "event";

export type Report = {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: ReportTargetType;
  targetId: string;
  targetLabel: string;
  reason: string;
  description?: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt?: string | null;
  resolutionNotes?: string | null;
};

export type CreateReportPayload = {
  reporterId: string;
  reporterName: string;
  targetType: ReportTargetType;
  targetId: string;
  targetLabel: string;
  reason: string;
  description?: string;
};
