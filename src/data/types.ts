export type Availability = 'Ready' | 'Busy' | 'Break' | 'Offline';
export type Channel = 'Voice' | 'Chat' | 'Email';
export type Priority = 'Urgent' | 'High' | 'Medium' | 'Low';
export type CaseStatus = 'New' | 'In Progress' | 'Waiting for Customer' | 'Escalated' | 'Resolved';
export interface Agent {
  id: string;
  name: string;
  initials: string;
  role: string;
  availability: Availability;
  team: string;
}
export interface Customer {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  company: string;
  plan: string;
  verified: boolean;
  avatar?: string;
}
export interface CaseRecord {
  id: string;
  customerId: string;
  title: string;
  description: string;
  priority: Priority;
  status: CaseStatus;
  ownerId: string | null;
  category: string;
}
export interface Message {
  id: string;
  author: string;
  body: string;
  createdAt: string;
  direction: 'inbound' | 'outbound';
}
export interface Interaction {
  id: string;
  customerId: string;
  caseId: string;
  channel: Channel;
  status: 'Waiting' | 'Active' | 'On Hold' | 'Ended';
  waitSeconds: number;
  messages: Message[];
}
export interface Note {
  id: string;
  caseId: string;
  authorId: string;
  body: string;
  createdAt: string;
}
export interface HistoryEntry {
  id: string;
  customerId: string;
  caseId: string;
  channel: Channel;
  subject: string;
  question: string;
  answer: string;
  outcome: string;
  createdAt: string;
  agent: string;
}
export interface FollowUp {
  id: string;
  caseId: string;
  ownerId: string;
  title: string;
  dueAt: string;
  completed: boolean;
  channel: Channel;
}
export interface Approval {
  id: string;
  caseId: string;
  reason: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Declined';
}
export interface Notification {
  id: string;
  title: string;
  detail: string;
  path: string;
}
export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  answer: string;
}
export interface AppState {
  version: 1;
  currentAgentId: string;
  selectedInteractionId: string;
  assistEnabled: boolean;
  agents: Agent[];
  customers: Customer[];
  cases: CaseRecord[];
  interactions: Interaction[];
  notes: Note[];
  history: HistoryEntry[];
  followUps: FollowUp[];
  approvals: Approval[];
  notifications: Notification[];
  knowledge: KnowledgeArticle[];
}
