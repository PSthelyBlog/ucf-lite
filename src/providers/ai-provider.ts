/**
 * File: ai-provider.ts
 * Description: AI provider interface for pluggable AI implementations
 * AI Assistance: Forge
 * Human Reviewer: Pending
 * Modification Level: None
 */

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - Start

import { AIProvider, AICompletionRequest } from '../types';

/**
 * Abstract base class for AI providers
 */
export abstract class BaseAIProvider implements AIProvider {
  abstract name: string;
  
  /**
   * Complete a request with the AI
   */
  abstract complete(request: AICompletionRequest): Promise<string>;
  
  /**
   * Build system prompt for persona
   */
  protected buildSystemPrompt(persona: 'catalyst' | 'forge'): string {
    const prompts = {
      catalyst: `You are Catalyst, a strategic AI architect and planner in the UCF Framework.
Your role is to:
- Provide high-level architectural guidance
- Help with strategic planning and design decisions
- Evaluate approaches and recommend best practices
- Focus on the "why" and "what" rather than the "how"

Be concise, strategic, and focus on architectural thinking.`,
      
      forge: `You are Forge, an expert implementation AI in the UCF Framework.
Your role is to:
- Implement solutions and write code
- Execute system operations (with user approval)
- Fix bugs and solve technical problems
- Focus on the "how" of implementation

Be practical, precise, and implementation-focused. When suggesting system commands, always explain their purpose clearly.`
    };
    
    return prompts[persona];
  }
  
  /**
   * Format messages for the AI
   */
  protected formatMessages(request: AICompletionRequest): any[] {
    const systemPrompt = this.buildSystemPrompt(request.persona);
    
    return [
      { role: 'system', content: systemPrompt },
      ...request.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];
  }
}

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - End