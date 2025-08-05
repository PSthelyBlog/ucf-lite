/**
 * File: personas.ts
 * Description: Persona routing logic for directing messages to appropriate AI personas
 * AI Assistance: Forge
 * Human Reviewer: Pending
 * Modification Level: None
 */

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - Start

/**
 * Routes messages to appropriate AI personas based on content patterns
 */
export class PersonaRouter {
  /**
   * Pattern definitions for each persona
   */
  private patterns = {
    catalyst: [
      // Strategic and architectural patterns
      /\b(architect|architecture|design|strategy|strategic|plan|planning)\b/i,
      /\b(should\s+i|how\s+to|what\s+if|which\s+approach)\b/i,
      /\b(best\s+practice|recommend|advice|suggest)\b/i,
      /\b(structure|organize|pattern)\b/i,
      /\b(framework|architecture)\s+(design|pattern|choice)\b/i,
      /\b(evaluate|compare|pros\s+and\s+cons|trade-?off)\b/i,
      /\b(workflow|process|methodology)\b/i,
      // Questions about approach
      /^(should|how|what|which|why|when)\s+/i,
    ],
    forge: [
      // Implementation and coding patterns
      /\b(implement|code|create|build|write|develop)\b/i,
      /\b(fix|debug|solve|patch|repair)\b/i,
      /\b(install|setup|configure|deploy)\b/i,
      /\b(function|class|method|api|endpoint)\b/i,
      /\b(test|testing|unit\s+test|integration)\b/i,
      /\b(refactor|optimize|improve\s+performance)\b/i,
      // System commands
      /\b(run|execute|command|npm|git|bash)\b/i,
      // File operations
      /\b(file|directory|folder|create\s+file|write\s+to)\b/i,
    ]
  };

  /**
   * Determine which persona should handle the message
   */
  determinePersona(content: string): 'catalyst' | 'forge' {
    // Clean the content for better matching
    const cleanContent = content.toLowerCase().trim();
    
    // Check for explicit persona mentions
    if (cleanContent.includes('@catalyst')) {
      return 'catalyst';
    }
    if (cleanContent.includes('@forge')) {
      return 'forge';
    }

    // Count matches for each persona
    let forgeScore = 0;
    let catalystScore = 0;

    // Check Forge patterns
    for (const pattern of this.patterns.forge) {
      if (pattern.test(cleanContent)) {
        forgeScore++;
      }
    }

    // Check Catalyst patterns
    for (const pattern of this.patterns.catalyst) {
      if (pattern.test(cleanContent)) {
        catalystScore++;
      }
    }

    // If Forge has higher score, route to Forge
    if (forgeScore > catalystScore) {
      return 'forge';
    }

    // Default to Catalyst for strategic/ambiguous queries
    return 'catalyst';
  }

  /**
   * Add custom patterns for a persona
   */
  addPattern(persona: 'catalyst' | 'forge', pattern: RegExp): void {
    this.patterns[persona].push(pattern);
  }

  /**
   * Get all patterns for a persona
   */
  getPatterns(persona: 'catalyst' | 'forge'): RegExp[] {
    return [...this.patterns[persona]];
  }

  /**
   * Analyze content and return match details
   */
  analyzeContent(content: string): {
    persona: 'catalyst' | 'forge';
    matches: { persona: string; pattern: string }[];
    scores: { catalyst: number; forge: number };
  } {
    const cleanContent = content.toLowerCase().trim();
    const matches: { persona: string; pattern: string }[] = [];
    let forgeScore = 0;
    let catalystScore = 0;

    // Check Forge patterns
    for (const pattern of this.patterns.forge) {
      if (pattern.test(cleanContent)) {
        forgeScore++;
        matches.push({ persona: 'forge', pattern: pattern.source });
      }
    }

    // Check Catalyst patterns
    for (const pattern of this.patterns.catalyst) {
      if (pattern.test(cleanContent)) {
        catalystScore++;
        matches.push({ persona: 'catalyst', pattern: pattern.source });
      }
    }

    return {
      persona: forgeScore > catalystScore ? 'forge' : 'catalyst',
      matches,
      scores: { catalyst: catalystScore, forge: forgeScore }
    };
  }
}

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - End