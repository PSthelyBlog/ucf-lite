/**
 * File: types.ts
 * Description: Core type definitions for UCF Lite Framework
 * AI Assistance: Forge
 * Human Reviewer: Pending
 * Modification Level: None
 */

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - Start

/**
 * Represents a message in the conversation
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  persona?: 'catalyst' | 'forge';
  timestamp: Date;
}

/**
 * Request for system command approval following ICERC protocol
 */
export interface ICERCRequest {
  id: string;
  intent: string;
  command: string;
  expectedOutcome?: string;
  risk: 'low' | 'medium' | 'high';
  timestamp?: Date;
}

/**
 * User decision on ICERC request
 */
export interface ICERCDecision {
  approved: boolean;
  reason?: string;
  timestamp: Date;
}

/**
 * Configuration for UCF Core
 */
export interface UCFConfig {
  aiProvider?: AIProvider;
  enableICERC?: boolean;
  plugins?: Plugin[];
}

/**
 * Base plugin interface for extending UCF functionality
 */
export interface Plugin {
  name: string;
  version: string;
  install(ucf: any): void; // Using any to avoid circular dependency
}

/**
 * AI provider interface for swappable implementations
 */
export interface AIProvider {
  name: string;
  complete(request: AICompletionRequest): Promise<string>;
}

/**
 * Request structure for AI completion
 */
export interface AICompletionRequest {
  messages: Message[];
  persona: 'catalyst' | 'forge';
  maxTokens?: number;
  temperature?: number;
}

/**
 * Event types emitted by UCF Core
 */
export interface UCFEventMap {
  'message': (message: Message) => void;
  'icerc-request': (request: ICERCRequest) => void;
  'icerc-decision': (decision: ICERCDecision) => void;
  'plugin-installed': (plugin: Plugin) => void;
  'error': (error: Error) => void;
}

/**
 * Conversation options
 */
export interface ConversationOptions {
  aiProvider: AIProvider;
  enableICERC: boolean;
}

/**
 * Command patterns for dangerous operations
 */
export const DANGEROUS_COMMANDS = [
  /^rm\s/,
  /^sudo\s/,
  /^chmod\s/,
  /^chown\s/,
  /^kill\s/,
  /^pkill\s/,
  /^systemctl\s/,
  /^service\s/,
  /^apt\s/,
  /^yum\s/,
  /^brew\s/,
  /^npm\s+i/,
  /^npm\s+install/,
  /^pip\s+install/,
  /^curl\s/,
  /^wget\s/,
  />.*\//,  // Redirect to root paths
  /\|\s*sudo/,  // Piping to sudo
];

/**
 * System command detection patterns
 */
export const SYSTEM_COMMAND_PATTERNS = [
  ...DANGEROUS_COMMANDS,
  /^ls\s/,
  /^cd\s/,
  /^pwd$/,
  /^echo\s/,
  /^cat\s/,
  /^grep\s/,
  /^find\s/,
  /^mkdir\s/,
  /^touch\s/,
  /^cp\s/,
  /^mv\s/,
];

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - End