/**
 * File: simple-cli.ts
 * Description: Simple CLI interface for UCF Framework
 * AI Assistance: Forge
 * Human Reviewer: Pending
 * Modification Level: None
 */

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - Start

import * as readline from 'readline';
import { Message } from '../types';

/**
 * Simple CLI interface for UCF
 */
export class SimpleCLI {
  private rl: readline.Interface;
  private isRunning = false;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'ucf> '
    });
  }

  /**
   * Start the CLI interface
   */
  async start(ucf: any): Promise<void> {
    this.isRunning = true;
    
    // Display welcome message
    this.displayWelcome();
    
    // Set up event listeners
    this.setupEventListeners(ucf);
    
    // Start prompt
    this.rl.prompt();
    
    // Handle line input
    this.rl.on('line', async (input) => {
      const trimmedInput = input.trim();
      
      // Handle special commands
      if (this.handleSpecialCommand(trimmedInput, ucf)) {
        if (this.isRunning) {
          this.rl.prompt();
        }
        return;
      }
      
      // Process regular message
      if (trimmedInput) {
        try {
          await ucf.chat(trimmedInput);
          // Response will be displayed via event listener
        } catch (error) {
          console.error('\n❌ Error:', (error as Error).message);
        }
      }
      
      if (this.isRunning) {
        this.rl.prompt();
      }
    });
    
    // Handle close
    this.rl.on('close', () => {
      this.displayGoodbye();
      process.exit(0);
    });
  }

  /**
   * Set up event listeners for UCF events
   */
  private setupEventListeners(ucf: any): void {
    // Listen for messages
    ucf.on('message', (message: Message) => {
      this.displayMessage(message);
    });
    
    // Listen for errors
    ucf.on('error', (error: Error) => {
      console.error('\n❌ Error:', error.message);
    });
  }

  /**
   * Handle special CLI commands
   */
  private handleSpecialCommand(input: string, ucf: any): boolean {
    const command = input.toLowerCase();
    
    switch (command) {
      case 'help':
      case '?':
        this.displayHelp();
        return true;
        
      case 'exit':
      case 'quit':
      case 'q':
        this.isRunning = false;
        this.rl.close();
        return true;
        
      case 'clear':
      case 'cls':
        console.clear();
        return true;
        
      case 'history':
        this.displayHistory(ucf);
        return true;
        
      case 'personas':
        this.displayPersonas();
        return true;
        
      default:
        // Check for plugin commands
        if (command.startsWith('/')) {
          const pluginCommand = command.substring(1);
          if (ucf.executeCommand?.(pluginCommand)) {
            return true;
          }
        }
        return false;
    }
  }

  /**
   * Display welcome message
   */
  private displayWelcome(): void {
    console.clear();
    console.log('═'.repeat(60));
    console.log('   Welcome to UCF Lite - Minimal AI Assistant Framework');
    console.log('═'.repeat(60));
    console.log('');
    console.log('Type "help" for available commands or start chatting!');
    console.log('Your messages will be routed to the appropriate AI persona.');
    console.log('');
  }

  /**
   * Display help information
   */
  private displayHelp(): void {
    console.log('\n📚 Available Commands:');
    console.log('─'.repeat(40));
    console.log('  help, ?      - Show this help message');
    console.log('  exit, quit   - Exit the application');
    console.log('  clear, cls   - Clear the screen');
    console.log('  history      - Show conversation history');
    console.log('  personas     - Show available personas');
    console.log('  @catalyst    - Direct message to Catalyst');
    console.log('  @forge       - Direct message to Forge');
    console.log('  /[command]   - Execute plugin command');
    console.log('─'.repeat(40));
    console.log('\n💡 Tips:');
    console.log('  • Strategic questions go to Catalyst');
    console.log('  • Implementation tasks go to Forge');
    console.log('  • System commands require approval');
    console.log('');
  }

  /**
   * Display personas information
   */
  private displayPersonas(): void {
    console.log('\n🤖 Available Personas:');
    console.log('─'.repeat(40));
    console.log('\n🎯 Catalyst - Strategic AI Architect');
    console.log('  • Architecture and design guidance');
    console.log('  • Best practices and patterns');
    console.log('  • Strategic planning and evaluation');
    console.log('  • High-level problem solving');
    
    console.log('\n🔨 Forge - Implementation Expert');
    console.log('  • Code implementation and debugging');
    console.log('  • System commands and operations');
    console.log('  • Technical problem solving');
    console.log('  • Practical solutions');
    console.log('');
  }

  /**
   * Display conversation history
   */
  private displayHistory(ucf: any): void {
    const history = ucf.getHistory?.() || [];
    
    if (history.length === 0) {
      console.log('\n📜 No conversation history yet.\n');
      return;
    }
    
    console.log('\n📜 Conversation History:');
    console.log('─'.repeat(60));
    
    history.forEach((message: Message) => {
      const time = new Date(message.timestamp).toLocaleTimeString();
      const persona = message.persona ? ` (${message.persona})` : '';
      console.log(`[${time}] ${message.role}${persona}: ${message.content}`);
    });
    
    console.log('─'.repeat(60));
    console.log('');
  }

  /**
   * Display a message with formatting
   */
  private displayMessage(message: Message): void {
    if (message.role === 'assistant') {
      console.log('');
      const persona = message.persona || 'assistant';
      const icon = persona === 'catalyst' ? '🎯' : '🔨';
      
      console.log(`${icon} ${persona.charAt(0).toUpperCase() + persona.slice(1)}:`);
      console.log('─'.repeat(40));
      console.log(message.content);
      console.log('');
    }
  }

  /**
   * Display goodbye message
   */
  private displayGoodbye(): void {
    console.log('\n👋 Thank you for using UCF Lite! Goodbye!\n');
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.isRunning = false;
    this.rl.close();
  }
}

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - End