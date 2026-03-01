// Analytics API Response Types

export interface OverviewResponse {
  totalUsers: number;
  totalMatches: number;
  totalQueueEntries: number;
  totalCommands: number;
  successfulMatches: number;
  matchSuccessRate: number;
  newUsersLast7Days: number;
}

export interface CommandStats {
  commandName: string;
  totalUsage: number;
  successCount: number;
  failureCount: number;
  successRate: number;
  avgExecutionTimeMs: number;
}

export interface CommandsResponse {
  commands: CommandStats[];
  period: string;
}

export interface QueueModeStats {
  game: "LOL" | "VAL";
  mode: string;
  totalEntries: number;
  successfulMatches: number;
  matchRate: number;
  avgWaitTimeMinutes: number;
}

export interface CurrentQueueState {
  game: "LOL" | "VAL";
  mode: string;
  waitingPlayers: number;
}

export interface QueuesResponse {
  modeStats: QueueModeStats[];
  currentQueueState: CurrentQueueState[];
  period: string;
}

export interface MatchStatusBreakdown {
  totalProposals: number;
  matched: number;
  declined: number;
  timedOut: number;
  pending: number;
  acceptanceRate: number;
  avgMatchScore: number;
}

export interface MatchesResponse {
  matchStatusBreakdown: MatchStatusBreakdown;
  period: string;
}

export interface EventCount {
  eventType: string;
  count: number;
}

export interface AnalyticsEvent {
  id: string;
  eventType: string;
  userId: string | null;
  metadata: Record<string, any> | null;
  createdAt: string;
}

export interface EventsResponse {
  eventCounts: EventCount[];
  recentEvents: AnalyticsEvent[];
  period: string;
}

export interface UsersByGame {
  LOL: number;
  VAL: number;
  unknown: number;
}

export interface UsersResponse {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  usersByGame: UsersByGame;
  period: string;
}

export interface DailyMetric {
  id: string;
  date: string;
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  totalQueueJoins: number;
  totalMatches: number;
  totalMatchDeclines: number;
  totalMatchTimeouts: number;
  averageWaitTimeMin: number;
  totalCommands: number;
  totalLfgPosts: number;
  totalLfgCompletions: number;
  totalTenMansMatches: number;
  createdAt: string;
  updatedAt: string;
}

export interface DailyMetricsResponse {
  dailyMetrics: DailyMetric[];
  period: string;
}

// Command Log types
export interface CommandLogEntry {
  id: string;
  userId: string;
  username: string;
  commandName: string;
  success: boolean;
  executionTimeMs: number | null;
  guildId: string | null;
  createdAt: string;
}

export interface CommandLogResponse {
  entries: CommandLogEntry[];
  total: number;
  period: string;
}

// Queue Player types
export interface QueuePlayer {
  game: "LOL" | "VAL";
  mode: string;
  userId: string;
  username: string;
  rank: string;
  joinedAt: string;
}

export interface QueuePlayersResponse {
  players: QueuePlayer[];
}

// Queue Log types
export interface QueueAction {
  id: string;
  userId: string;
  username: string;
  game: "LOL" | "VAL";
  mode: string;
  status: string;
  joinedAt: string;
  matchedAt: string | null;
  updatedAt: string;
}

export interface QueueLogResponse {
  actions: QueueAction[];
  period: string;
}

export interface MatchingQualityResponse {
  acceptanceRate: number;
  positiveFeedbackRatio: number;
  reQueueRate: number;
  feedbackSubmissionRate: number;
  timeToMatch: {
    avgMinutes: number;
    medianMinutes: number;
    p95Minutes: number;
  };
  repeatMatching: {
    repeatPairCount: number;
    totalRepeatMatches: number;
  };
  lfRequestAcceptanceRate: number;
  counts: {
    totalProposals: number;
    matchedProposals: number;
    declinedProposals: number;
    timedOutProposals: number;
    positiveFeedback: number;
    negativeFeedback: number;
    totalFeedback: number;
    requeues: number;
    leaves: number;
    lfAccepted: number;
    lfDeclined: number;
    lfExpired: number;
    lfTotal: number;
  };
  period: string;
}

// Funnel Analytics types

export interface FunnelStepStats {
  step_number: number;
  step_name: string;
  sessions_reached: number;
  sessions_completed: number;
  drop_off_count: number;
  drop_off_rate: number;
  avg_time_seconds: number;
}

export interface FunnelFieldInteraction {
  step_number: number;
  field_name: string;
  interaction_count: number;
  unique_sessions: number;
}

export interface FunnelValidationFailure {
  step_number: number;
  field_name: string;
  failure_count: number;
  unique_sessions: number;
}

export interface FunnelRecentSession {
  session_id: string;
  discord_id: string | null;
  started_at: string;
  last_activity_at: string;
  max_step_reached: number;
  completed: boolean;
  event_count: number;
  duration_seconds: number;
}

export interface FunnelDailyCount {
  date: string;
  started: number;
  completed: number;
}

export interface FunnelStatsResponse {
  period: string;
  overview: {
    total_sessions: number;
    completed_sessions: number;
    conversion_rate: number;
    abandoned_sessions: number;
  };
  steps: FunnelStepStats[];
  field_interactions: FunnelFieldInteraction[];
  validation_failures: FunnelValidationFailure[];
  recent_sessions: FunnelRecentSession[];
  daily_sessions: FunnelDailyCount[];
}

export interface BotGuild {
  id: string;
  name: string;
  memberCount: number;
  iconHash: string | null;
  ownerId: string | null;
  isActive: boolean;
  joinedAt: string;
  leftAt: string | null;
  updatedAt: string;
}

export interface GuildsResponse {
  guilds: BotGuild[];
  summary: {
    total: number;
    active: number;
    totalMembers: number;
  };
}

export interface Affiliate {
  id: string;
  code: string;
  name: string;
  platform: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deactivatedAt: string | null;
  totalSignups: number;
  last30DaysSignups: number;
}

export interface AffiliatesResponse {
  affiliates: Affiliate[];
}
