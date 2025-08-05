/**
 * File: index.ts
 * Description: Main UCFCore class integrating all components
 * AI Assistance: Forge
 * Human Reviewer: Pending
 * Modification Level: None
 */

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - Start

import { EventEmitter } from 'events';
import { 
  UCFConfig, 
  Message, 
  Plugin,
  UCFEventMap 
} from './types';
import { Conversation } from './core/conversation';
import { PersonaRouter } from './core/personas';
import { ICERCProtocol } from './core/icerc';
import { PluginManager } from './core/plugin';
import { MockAIProvider } from './providers/mock-ai';

/**
 * Main UCF Core class
 */
export class UCFCore extends EventEmitter {
  private conversation: Conversation;
  private personaRouter: PersonaRouter;
  private icercProtocol: ICERCProtocol;
  private pluginManager: PluginManager;
  private config: UCFConfig;
  private commands: Map<string, () => void> = new Map();

  constructor(config: UCFConfig = {}) {
    super();
    
    // Set default configuration
    this.config = {
      aiProvider: config.aiProvider || new MockAIProvider(),
      enableICERC: config.enableICERC !== undefined ? config.enableICERC : true,
      plugins: config.plugins || []
    };

    // Initialize components
    this.conversation = new Conversation({
      aiProvider: this.config.aiProvider!,
      enableICERC: this.config.enableICERC!
    });
    
    this.personaRouter = new PersonaRouter();
    this.icercProtocol = new ICERCProtocol();
    this.pluginManager = new PluginManager();

    // Install plugins
    this.config.plugins!.forEach(plugin => {
      this.pluginManager.register(plugin, this);
    });
  }

  /**
   * Main chat interface
   */
  async chat(message: string): Promise<Message> {
    try {
      // Determine persona
      const persona = this.personaRouter.determinePersona(message);
      
      // Send message and get response
      const response = await this.conversation.sendMessage(message, persona);
      
      // Check if response contains system commands
      if (this.config.enableICERC && ICERCProtocol.containsSystemCommand(response.content)) {
        const command = ICERCProtocol.extractCommand(response.content);
        
        if (command) {
          // Create ICERC request
          const icercRequest = ICERCProtocol.createRequest(
            command,
            `Execute command suggested by ${persona}`
          );
          
          // Emit ICERC request event
          this.emit('icerc-request', icercRequest);
          
          // Request approval
          const decision = await this.icercProtocol.requestApproval(icercRequest);
          
          // Emit decision event
          this.emit('icerc-decision', decision);
          
          // If denied, modify response
          if (!decision.approved) {
            response.content = `Command execution denied: ${command}\n\nThe command was not executed. You can run it manually if needed.`;
          }
        }
      }
      
      // Emit message event
      this.emit('message', response);
      
      return response;
    } catch (error) {
      this.emit('error', error as Error);
      throw error;
    }
  }

  /**
   * Get conversation history
   */
  getHistory(): Message[] {
    return this.conversation.getHistory();
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversation.clear();
  }

  /**
   * Add a custom command
   */
  addCommand(name: string, handler: () => void): void {
    this.commands.set(name, handler);
  }

  /**
   * Execute a custom command
   */
  executeCommand(name: string): boolean {
    const handler = this.commands.get(name);
    if (handler) {
      handler();
      return true;
    }
    return false;
  }

  /**
   * Install a plugin
   */
  installPlugin(plugin: Plugin): void {
    this.pluginManager.register(plugin, this);
    this.emit('plugin-installed', plugin);
  }

  /**
   * Get installed plugins
   */
  getPlugins(): Plugin[] {
    return this.pluginManager.getPlugins();
  }

  /**
   * Get persona router for customization
   */
  getPersonaRouter(): PersonaRouter {
    return this.personaRouter;
  }

  /**
   * Analyze message routing
   */
  analyzeRouting(message: string): any {
    return this.personaRouter.analyzeContent(message);
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.icercProtocol.cleanup();
    this.removeAllListeners();
  }

  /**
   * Type-safe event emitter
   */
  on<K extends keyof UCFEventMap>(event: K, listener: UCFEventMap[K]): this {
    return super.on(event, listener);
  }

  emit<K extends keyof UCFEventMap>(
    event: K,
    ...args: Parameters<UCFEventMap[K]>
  ): boolean {
    return super.emit(event, ...args);
  }
}

// Export all public APIs
export * from './types';
export { Conversation } from './core/conversation';
export { PersonaRouter } from './core/personas';
export { ICERCProtocol } from './core/icerc';
export { UCFPlugin, LoggerPlugin, MetricsPlugin } from './core/plugin';
export { BaseAIProvider } from './providers/ai-provider';
export { MockAIProvider } from './providers/mock-ai';
export { SimpleCLI } from './cli/simple-cli';

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - End