/**
 * File: conversation.ts
 * Description: Core conversation management system
 * AI Assistance: Forge
 * Human Reviewer: Pending
 * Modification Level: None
 */

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - Start

import { randomUUID } from 'crypto';
import { Message, AIProvider, ConversationOptions } from '../types';

/**
 * Manages conversation history and message exchange
 */
export class Conversation {
  private messages: Message[] = [];
  private aiProvider: AIProvider;
  private options: ConversationOptions;

  constructor(options: ConversationOptions) {
    this.aiProvider = options.aiProvider;
    this.options = options; // Store for future use
  }

  /**
   * Send a message and get AI response
   */
  async sendMessage(content: string, persona: 'catalyst' | 'forge'): Promise<Message> {
    // Create and store user message
    const userMessage = this.createMessage('user', content);
    this.messages.push(userMessage);

    // Get AI response
    const response = await this.aiProvider.complete({
      messages: this.messages,
      persona
    });

    // Create and store assistant message
    const assistantMessage = this.createMessage('assistant', response, persona);
    this.messages.push(assistantMessage);

    return assistantMessage;
  }

  /**
   * Get conversation history
   */
  getHistory(): Message[] {
    return [...this.messages];
  }

  /**
   * Get conversation options
   */
  getOptions(): ConversationOptions {
    return this.options;
  }

  /**
   * Get recent messages for context window
   */
  getRecentMessages(count: number = 10): Message[] {
    return this.messages.slice(-count);
  }

  /**
   * Clear conversation history
   */
  clear(): void {
    this.messages = [];
  }

  /**
   * Get message count
   */
  getMessageCount(): number {
    return this.messages.length;
  }

  /**
   * Create a message object
   */
  private createMessage(
    role: 'user' | 'assistant',
    content: string,
    persona?: 'catalyst' | 'forge'
  ): Message {
    return {
      id: randomUUID(),
      role,
      content,
      persona,
      timestamp: new Date()
    };
  }

  /**
   * Get the last message
   */
  getLastMessage(): Message | undefined {
    return this.messages[this.messages.length - 1];
  }

  /**
   * Get messages by role
   */
  getMessagesByRole(role: 'user' | 'assistant'): Message[] {
    return this.messages.filter(m => m.role === role);
  }

  /**
   * Get messages by persona
   */
  getMessagesByPersona(persona: 'catalyst' | 'forge'): Message[] {
    return this.messages.filter(m => m.persona === persona);
  }
}

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - End