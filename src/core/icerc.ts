/**
 * File: icerc.ts
 * Description: ICERC (Intent, Command, Expected Outcome, Risk, Confirmation) Protocol Implementation
 * AI Assistance: Forge
 * Human Reviewer: Pending
 * Modification Level: None
 */

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - Start

import { randomUUID } from 'crypto';
import * as readline from 'readline';
import { ICERCRequest, ICERCDecision, DANGEROUS_COMMANDS, SYSTEM_COMMAND_PATTERNS } from '../types';

/**
 * Implements the ICERC security protocol for command approval
 */
export class ICERCProtocol {
  private rl?: readline.Interface;

  /**
   * Request user approval for a command
   */
  async requestApproval(request: ICERCRequest): Promise<ICERCDecision> {
    // Display the ICERC request
    this.displayRequest(request);

    // Get user decision
    const approved = await this.promptUser();

    return {
      approved,
      reason: approved ? 'User approved' : 'User denied',
      timestamp: new Date()
    };
  }

  /**
   * Display formatted ICERC request
   */
  private displayRequest(request: ICERCRequest): void {
    console.log('\n' + '='.repeat(60));
    console.log('🔒 SECURITY APPROVAL REQUIRED - ICERC PROTOCOL');
    console.log('='.repeat(60));
    console.log(`📋 Intent: ${request.intent}`);
    console.log(`💻 Command: ${request.command}`);
    if (request.expectedOutcome) {
      console.log(`✅ Expected Outcome: ${request.expectedOutcome}`);
    }
    console.log(`⚠️  Risk Level: ${this.formatRiskLevel(request.risk)}`);
    console.log('='.repeat(60));
  }

  /**
   * Format risk level with color codes (for future enhancement)
   */
  private formatRiskLevel(risk: 'low' | 'medium' | 'high'): string {
    const riskMap = {
      low: 'LOW ✓',
      medium: 'MEDIUM ⚠',
      high: 'HIGH ⚠️⚠️'
    };
    return riskMap[risk];
  }

  /**
   * Prompt user for approval
   */
  private async promptUser(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.rl) {
        this.rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
      }

      this.rl.question('Approve command execution? [y/N]: ', (answer) => {
        const approved = answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
        resolve(approved);
      });
    });
  }

  /**
   * Check if content contains a system command
   */
  static containsSystemCommand(content: string): boolean {
    const cleanContent = content.trim();
    return SYSTEM_COMMAND_PATTERNS.some(pattern => pattern.test(cleanContent));
  }

  /**
   * Extract command from content
   */
  static extractCommand(content: string): string | null {
    // Look for code blocks first
    const codeBlockMatch = content.match(/```(?:bash|sh|shell)?\n([\s\S]*?)```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }

    // Look for inline commands
    const inlineMatch = content.match(/`([^`]+)`/);
    if (inlineMatch && this.containsSystemCommand(inlineMatch[1])) {
      return inlineMatch[1].trim();
    }

    // Check if the entire message is a command
    if (this.containsSystemCommand(content)) {
      return content.trim();
    }

    return null;
  }

  /**
   * Assess risk level of a command
   */
  static assessRisk(command: string): 'low' | 'medium' | 'high' {
    const cleanCommand = command.trim();

    // Check for high-risk patterns
    for (const pattern of DANGEROUS_COMMANDS) {
      if (pattern.test(cleanCommand)) {
        return 'high';
      }
    }

    // Check for medium-risk patterns
    const mediumRiskPatterns = [
      /npm\s+run/,
      /node\s/,
      /python\s/,
      /git\s+push/,
      /git\s+commit/,
    ];

    for (const pattern of mediumRiskPatterns) {
      if (pattern.test(cleanCommand)) {
        return 'medium';
      }
    }

    // Default to low risk for other commands
    return 'low';
  }

  /**
   * Create an ICERC request from a command
   */
  static createRequest(command: string, intent?: string): ICERCRequest {
    return {
      id: `icerc-${randomUUID()}`,
      intent: intent || 'Execute system command',
      command,
      risk: this.assessRisk(command),
      timestamp: new Date()
    };
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    if (this.rl) {
      this.rl.close();
      this.rl = undefined;
    }
  }
}

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - End