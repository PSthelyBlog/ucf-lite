/**
 * File: plugin.ts
 * Description: AnthropicPlugin implementation for UCF Lite framework
 * AI Assistance: Forge AI Assistant
 * Task ID: RFI-UCF-ANTHROPIC-001
 * Human Reviewer: Pending
 * Modification Level: AI-GENERATED
 */

import { UCFPlugin } from '../../core/plugin';
import { AnthropicProvider } from './provider';

export interface AnthropicPluginOptions {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  systemPrompts?: {
    catalyst?: string;
    forge?: string;
  };
}

// AI-GENERATED: Forge - Task:RFI-UCF-ANTHROPIC-001 - Start
export class AnthropicPlugin extends UCFPlugin {
  name = 'anthropic';
  version = '1.0.0';
  
  private apiKey?: string;
  private model: string;
  private maxTokens: number;
  private systemPrompts?: {
    catalyst?: string;
    forge?: string;
  };

  constructor(options?: AnthropicPluginOptions) {
    super();
    
    // Load API key from environment or options
    this.apiKey = options?.apiKey || process.env.ANTHROPIC_API_KEY;
    
    // Set model with default
    this.model = options?.model || 'claude-opus-4-1-20250805';
    
    // Set max tokens with default
    this.maxTokens = options?.maxTokens || 1024;
    
    // Store system prompts if provided
    this.systemPrompts = options?.systemPrompts;
  }

  /**
   * Install the plugin and register AnthropicProvider
   * @param ucf - UCFCore instance
   */
  install(ucf: any): void {
    if (!this.apiKey) {
      throw new Error(
        'AnthropicPlugin: API key required. Set ANTHROPIC_API_KEY environment variable or provide apiKey in options.'
      );
    }

    // Create the Anthropic provider
    const provider = new AnthropicProvider({
      apiKey: this.apiKey,
      model: this.model,
      maxTokens: this.maxTokens,
      systemPrompts: this.systemPrompts
    });

    // Set the AI provider on the conversation (access internal API)
    if (ucf.conversation) {
      ucf.conversation.aiProvider = provider;
    }

    // Store provider reference on plugin for uninstallation
    this.provider = provider;

    console.log(`AnthropicPlugin v${this.version} installed successfully`);
  }

  /**
   * Uninstall the plugin and remove provider
   * @param ucf - UCFCore instance  
   */
  uninstall(ucf: any): void {
    // Reset to default MockAI provider if we installed Anthropic
    if (ucf.conversation && this.provider) {
      const { MockAIProvider } = require('../../providers/mock-ai');
      ucf.conversation.aiProvider = new MockAIProvider();
    }

    console.log(`AnthropicPlugin v${this.version} uninstalled`);
  }

  private provider?: AnthropicProvider;
}
// AI-GENERATED: Forge - Task:RFI-UCF-ANTHROPIC-001 - End