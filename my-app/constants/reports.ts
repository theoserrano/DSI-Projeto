import type { Report } from "@/types/reports";

export const REPORT_REASONS = [
  "Conteúdo ofensivo",
  "Informação incorreta",
  "Spam ou promoção",
  "Violação de direitos autorais",
  "Outro",
] as const;

export const REPORTS_SEED: Report[] = [
  {
    id: "rpt-001",
    reporterId: "usr-123",
    reporterName: "Maria Silva",
    targetType: "review",
    targetId: "rev-992",
    targetLabel: "Review de 'Shape of You'",
    reason: "Conteúdo ofensivo",
    description: "Usuário utilizou linguagem inadequada no comentário.",
    status: "open",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "rpt-002",
    reporterId: "usr-891",
    reporterName: "Lucas Pereira",
    targetType: "user",
    targetId: "user-502",
    targetLabel: "Perfil de @noisyuser",
    reason: "Spam ou promoção",
    description: "Usuário envia convites suspeitos para usuários novos.",
    status: "in_review",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "rpt-003",
    reporterId: "usr-456",
    reporterName: "Ana Costa",
    targetType: "event",
    targetId: "show-210",
    targetLabel: "Show Indie Sunset - Recife",
    reason: "Informação incorreta",
    status: "resolved",
    description: "Data do evento estava errada.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    resolutionNotes: "Atualizamos a data com a produção do evento.",
  },
];
