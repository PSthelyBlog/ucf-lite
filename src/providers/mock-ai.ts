/**
 * File: mock-ai.ts
 * Description: Mock AI provider for testing without API keys
 * AI Assistance: Forge
 * Human Reviewer: Pending
 * Modification Level: None
 */

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - Start

import { AICompletionRequest } from '../types';
import { BaseAIProvider } from './ai-provider';

/**
 * Mock AI provider for testing
 */
export class MockAIProvider extends BaseAIProvider {
  name = 'mock-ai';
  private responseDelay: number;

  constructor(options?: { responseDelay?: number }) {
    super();
    this.responseDelay = options?.responseDelay ?? 100;
  }

  async complete(request: AICompletionRequest): Promise<string> {
    // Simulate network delay
    await this.delay(this.responseDelay);
    
    const lastMessage = request.messages[request.messages.length - 1];
    const userContent = lastMessage.content.toLowerCase();
    
    // Generate persona-appropriate responses
    if (request.persona === 'catalyst') {
      return this.generateCatalystResponse(userContent);
    } else {
      return this.generateForgeResponse(userContent);
    }
  }

  private generateCatalystResponse(content: string): string {
    // Architecture and strategy responses
    if (content.includes('structure') || content.includes('architect')) {
      return `For structuring your application, I recommend following a layered architecture:

1. **Presentation Layer**: Handle user interactions
2. **Business Logic Layer**: Core application logic
3. **Data Access Layer**: Database and external API interactions
4. **Cross-Cutting Concerns**: Logging, security, error handling

This separation of concerns will make your application more maintainable and testable. Would you like me to elaborate on any of these layers?`;
    }
    
    if (content.includes('should') || content.includes('best practice')) {
      return `Based on best practices, I recommend:

1. Start with a clear domain model
2. Use dependency injection for flexibility
3. Implement comprehensive error handling
4. Write tests as you develop
5. Document your architectural decisions

These practices will ensure your project remains maintainable as it grows. What specific aspect would you like to explore further?`;
    }
    
    if (content.includes('api') || content.includes('rest')) {
      return `For a REST API design, consider these principles:

1. **Resource-Based URLs**: Use nouns, not verbs (e.g., /users, not /getUsers)
2. **HTTP Methods**: GET (read), POST (create), PUT (update), DELETE (remove)
3. **Status Codes**: Use appropriate HTTP status codes
4. **Versioning**: Include version in URL or headers
5. **Documentation**: OpenAPI/Swagger specification

This approach ensures a consistent and predictable API. Shall I help you design specific endpoints?`;
    }
    
    // Default strategic response
    return `I understand you're looking for strategic guidance. Let me analyze the situation:

The key consideration here is balancing immediate needs with long-term maintainability. I recommend starting with a simple, well-structured foundation that can evolve as requirements become clearer.

What specific aspects of this challenge would you like to explore?`;
  }

  private generateForgeResponse(content: string): string {
    // Implementation and coding responses
    if (content.includes('create') || content.includes('implement')) {
      if (content.includes('function')) {
        return `I'll create that function for you:

\`\`\`typescript
function processData(input: any[]): any[] {
  // Validate input
  if (!Array.isArray(input)) {
    throw new Error('Input must be an array');
  }
  
  // Process each item
  return input.map(item => ({
    ...item,
    processed: true,
    timestamp: new Date()
  }));
}
\`\`\`

This function includes input validation and returns a new array with processed items. Would you like me to add more specific functionality?`;
      }
      
      if (content.includes('rest') || content.includes('endpoint')) {
        return `Here's a REST endpoint implementation:

\`\`\`typescript
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
\`\`\`

This endpoint includes error handling and appropriate status codes. Need me to implement other CRUD operations?`;
      }
    }
    
    if (content.includes('fix') || content.includes('debug')) {
      return `I'll help you debug this issue. Based on the context, here are the steps:

1. First, let's check the error logs
2. Verify the input data format
3. Add console.log statements at key points
4. Check for any async/await issues

Can you share the specific error message or problematic code?`;
    }
    
    if (content.includes('install') || content.includes('npm')) {
      return `To install the required package, run:

\`\`\`bash
npm install express
\`\`\`

This will add Express.js to your project. After installation, you can import it with:

\`\`\`typescript
import express from 'express';
\`\`\``;
    }
    
    // Default implementation response
    return `I'll help you implement that. Here's a practical approach:

1. Define the interface/types first
2. Implement the core logic
3. Add error handling
4. Write unit tests

Let me know which part you'd like to start with, and I'll provide the specific implementation.`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - End