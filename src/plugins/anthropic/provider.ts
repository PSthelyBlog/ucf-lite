/**
 * File: provider.ts
 * Description: AnthropicProvider implementation for Anthropic Claude API integration
 * AI Assistance: Forge AI Assistant
 * Task ID: RFI-UCF-ANTHROPIC-001
 * Human Reviewer: Pending
 * Modification Level: AI-GENERATED
 */

import { BaseAIProvider } from '../../providers/ai-provider';
import { AICompletionRequest, Message } from '../../types';

export interface AnthropicProviderOptions {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  systemPrompts?: {
    catalyst?: string;
    forge?: string;
  };
}

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AnthropicRequest {
  model: string;
  max_tokens: number;
  messages: AnthropicMessage[];
  system?: string;
}

interface AnthropicResponse {
  id: string;
  type: 'message';
  role: 'assistant';
  content: Array<{ type: 'text'; text: string }>;
  model: string;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface AnthropicError {
  type: string;
  error: {
    type: string;
    message: string;
  };
}

// AI-GENERATED: Forge - Task:RFI-UCF-ANTHROPIC-001 - Start
export class AnthropicProvider extends BaseAIProvider {
  name = 'anthropic';
  
  private apiKey: string;
  private model: string;
  private maxTokens: number;
  private apiUrl = 'https://api.anthropic.com/v1/messages';
  private systemPrompts?: {
    catalyst?: string;
    forge?: string;
  };

  constructor(options: AnthropicProviderOptions) {
    super();
    
    this.apiKey = options.apiKey;
    this.model = options.model || 'claude-opus-4-1-20250805';
    this.maxTokens = options.maxTokens || 1024;
    this.systemPrompts = options.systemPrompts;
  }

  /**
   * Complete a conversation using the Anthropic API
   * @param request - AI completion request
   * @returns The assistant's response
   */
  async complete(request: AICompletionRequest): Promise<string> {
    try {
      // Convert conversation messages to Anthropic format
      const messages = this.convertMessages(request.messages);
      
      // Get system prompt based on persona
      const systemPrompt = this.getSystemPrompt(request.persona);
      
      // Build the API request payload
      const payload: AnthropicRequest = {
        model: this.model,
        max_tokens: this.maxTokens,
        messages: messages
      };
      
      // Add system prompt if available
      if (systemPrompt) {
        payload.system = systemPrompt;
      }
      
      // Make the API request with retry logic
      const response = await this.makeRequestWithRetry(payload);
      
      // Extract and return the response text
      if (response.content && response.content.length > 0) {
        return response.content[0].text;
      }
      
      throw new Error('Empty response from Anthropic API');
      
    } catch (error) {
      // Re-throw with context
      throw new Error(`AnthropicProvider error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Convert UCF conversation messages to Anthropic format
   * @param messages - Conversation messages
   * @returns Anthropic formatted messages
   */
  private convertMessages(messages: Message[]): AnthropicMessage[] {
    return messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
  }

  /**
   * Get system prompt based on persona
   * @param persona - The active persona
   * @returns System prompt or undefined
   */
  private getSystemPrompt(persona?: string): string | undefined {
    if (!persona) return undefined;
    
    const lowerPersona = persona.toLowerCase();
    
    if (lowerPersona === 'catalyst' && this.systemPrompts?.catalyst) {
      return this.systemPrompts.catalyst;
    }
    
    if (lowerPersona === 'forge' && this.systemPrompts?.forge) {
      return this.systemPrompts.forge;
    }
    
    // Default system prompts for personas
    if (lowerPersona === 'catalyst') {
      return 'You are Catalyst, a strategic AI architect focused on high-level design and planning.';
    }
    
    if (lowerPersona === 'forge') {
      return 'You are Forge, an expert implementer focused on writing secure, efficient code.';
    }
    
    return undefined;
  }

  /**
   * Make API request with exponential backoff retry logic
   * @param payload - Request payload
   * @param attempt - Current attempt number
   * @returns API response
   */
  private async makeRequestWithRetry(
    payload: AnthropicRequest,
    attempt: number = 1
  ): Promise<AnthropicResponse> {
    const maxAttempts = 3;
    const baseDelay = 1000; // 1 second
    
    try {
      return await this.makeRequest(payload);
    } catch (error: any) {
      // Check if it's a rate limit error (429)
      if (error.status === 429 && attempt < maxAttempts) {
        // Calculate exponential backoff delay
        const delay = baseDelay * Math.pow(2, attempt - 1);
        
        // Check for Retry-After header
        const retryAfter = error.retryAfter;
        const waitTime = retryAfter ? retryAfter * 1000 : delay;
        
        console.log(`Rate limited. Retrying in ${waitTime}ms (attempt ${attempt}/${maxAttempts})`);
        
        // Wait before retrying
        await this.sleep(waitTime);
        
        // Retry the request
        return this.makeRequestWithRetry(payload, attempt + 1);
      }
      
      // Re-throw if not rate limit or max attempts reached
      throw error;
    }
  }

  /**
   * Make a single API request to Anthropic
   * @param payload - Request payload
   * @returns API response
   */
  private async makeRequest(payload: AnthropicRequest): Promise<AnthropicResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60-second timeout
    
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        await this.handleApiError(response);
      }
      
      const data = await response.json() as AnthropicResponse;
      return data;
      
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      // Handle abort/timeout
      if (error.name === 'AbortError') {
        throw new Error('Request timeout: API call exceeded 60 seconds');
      }
      
      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Handle API error responses
   * @param response - Fetch response
   */
  private async handleApiError(response: Response): Promise<never> {
    let errorMessage = `API error: ${response.status} ${response.statusText}`;
    let errorData: AnthropicError | null = null;
    
    try {
      errorData = await response.json() as AnthropicError;
      if (errorData?.error?.message) {
        errorMessage = `API error (${response.status}): ${errorData.error.message}`;
      }
    } catch {
      // Failed to parse error response, use default message
    }
    
    // Create error with status for retry logic
    const error: any = new Error(errorMessage);
    error.status = response.status;
    
    // Add Retry-After header value if present
    const retryAfter = response.headers.get('retry-after');
    if (retryAfter) {
      error.retryAfter = parseInt(retryAfter, 10);
    }
    
    // Handle specific error codes
    switch (response.status) {
      case 400:
        throw new Error(`Bad request: ${errorData?.error?.message || 'Invalid request format'}`);
      case 401:
        throw new Error('Authentication failed: Invalid API key');
      case 429:
        // Rate limit - will be handled by retry logic
        throw error;
      case 500:
      case 529:
        throw new Error(`Server error: ${errorData?.error?.message || 'Anthropic service unavailable'}`);
      default:
        throw error;
    }
  }

  /**
   * Sleep helper for retry delays
   * @param ms - Milliseconds to sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
// AI-GENERATED: Forge - Task:RFI-UCF-ANTHROPIC-001 - End