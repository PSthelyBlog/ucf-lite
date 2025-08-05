/**
 * File: personas.test.ts
 * Description: Unit tests for PersonaRouter
 * AI Assistance: Forge
 * Human Reviewer: Pending
 * Modification Level: None
 */

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - Start

import { PersonaRouter } from '../../src/core/personas';

describe('PersonaRouter', () => {
  let router: PersonaRouter;

  beforeEach(() => {
    router = new PersonaRouter();
  });

  describe('determinePersona', () => {
    test('should route strategic questions to catalyst', () => {
      const catalystQueries = [
        'How should I structure my application?',
        'What architecture pattern should I use?',
        'Can you recommend a design approach?',
        'What if we use microservices?',
        'Should I use REST or GraphQL?'
      ];

      catalystQueries.forEach(query => {
        expect(router.determinePersona(query)).toBe('catalyst');
      });
    });

    test('should route implementation tasks to forge', () => {
      const forgeQueries = [
        'Create a function to process data',
        'Implement the user service',
        'Fix the authentication bug',
        'Install express framework',
        'Write unit tests for the API'
      ];

      forgeQueries.forEach(query => {
        expect(router.determinePersona(query)).toBe('forge');
      });
    });

    test('should respect explicit persona mentions', () => {
      expect(router.determinePersona('Hey @catalyst, help me design')).toBe('catalyst');
      expect(router.determinePersona('Hi @forge, create a function')).toBe('forge');
    });

    test('should default to catalyst for ambiguous queries', () => {
      const ambiguousQueries = [
        'Tell me about this',
        'I need help',
        'What do you think?'
      ];

      ambiguousQueries.forEach(query => {
        expect(router.determinePersona(query)).toBe('catalyst');
      });
    });
  });

  describe('analyzeContent', () => {
    test('should provide detailed analysis with scores', () => {
      const analysis = router.analyzeContent('How should I implement the API design?');
      
      expect(analysis).toHaveProperty('persona');
      expect(analysis).toHaveProperty('matches');
      expect(analysis).toHaveProperty('scores');
      expect(analysis.scores).toHaveProperty('catalyst');
      expect(analysis.scores).toHaveProperty('forge');
    });

    test('should identify multiple pattern matches', () => {
      const analysis = router.analyzeContent('Create and implement a REST API with proper architecture');
      
      expect(analysis.matches.length).toBeGreaterThan(0);
      expect(analysis.scores.catalyst).toBeGreaterThan(0);
      expect(analysis.scores.forge).toBeGreaterThan(0);
    });
  });

  describe('pattern management', () => {
    test('should allow adding custom patterns', () => {
      const customPattern = /custom-catalyst-pattern/i;
      router.addPattern('catalyst', customPattern);
      
      expect(router.determinePersona('This has custom-catalyst-pattern')).toBe('catalyst');
    });

    test('should return copy of patterns', () => {
      const patterns = router.getPatterns('catalyst');
      patterns.push(/new-pattern/);
      
      // Original patterns should not be modified
      const originalPatterns = router.getPatterns('catalyst');
      expect(originalPatterns.length).toBeLessThan(patterns.length);
    });
  });
});

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - End