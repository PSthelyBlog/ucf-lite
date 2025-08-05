/**
 * File: plugin.ts
 * Description: Plugin system for extending UCF functionality
 * AI Assistance: Forge
 * Human Reviewer: Pending
 * Modification Level: None
 */

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - Start

import { Plugin } from '../types';

/**
 * Abstract base class for UCF plugins
 */
export abstract class UCFPlugin implements Plugin {
  abstract name: string;
  abstract version: string;
  
  /**
   * Install the plugin into UCF Core
   */
  abstract install(ucf: any): void;
  
  /**
   * Optional cleanup method
   */
  uninstall?(ucf: any): void;
}

/**
 * Example logger plugin
 */
export class LoggerPlugin extends UCFPlugin {
  name = 'logger';
  version = '1.0.0';
  private logFile?: string;

  constructor(options?: { logFile?: string }) {
    super();
    this.logFile = options?.logFile; // Store for future file logging implementation
  }

  install(ucf: any): void {
    console.log(`[${this.name}] Installing logger plugin v${this.version}`);
    
    // Log all messages
    ucf.on('message', (message: any) => {
      const timestamp = new Date().toISOString();
      const log = `[${timestamp}] ${message.role}: ${message.content}`;
      console.log(log);
      
      // Future: write to file if logFile is specified
      if (this.logFile) {
        // TODO: Implement file logging
      }
    });

    // Log ICERC requests
    ucf.on('icerc-request', (request: any) => {
      console.log(`[${this.name}] ICERC Request: ${request.command} (Risk: ${request.risk})`);
    });

    // Log ICERC decisions
    ucf.on('icerc-decision', (decision: any) => {
      console.log(`[${this.name}] ICERC Decision: ${decision.approved ? 'APPROVED' : 'DENIED'}`);
    });
  }
}

/**
 * Example metrics plugin
 */
export class MetricsPlugin extends UCFPlugin {
  name = 'metrics';
  version = '1.0.0';
  private metrics = {
    messagesTotal: 0,
    messagesByCatalyst: 0,
    messagesByForge: 0,
    icercRequests: 0,
    icercApproved: 0,
    icercDenied: 0,
  };

  install(ucf: any): void {
    console.log(`[${this.name}] Installing metrics plugin v${this.version}`);
    
    // Track messages
    ucf.on('message', (message: any) => {
      this.metrics.messagesTotal++;
      if (message.persona === 'catalyst') {
        this.metrics.messagesByCatalyst++;
      } else if (message.persona === 'forge') {
        this.metrics.messagesByForge++;
      }
    });

    // Track ICERC
    ucf.on('icerc-request', () => {
      this.metrics.icercRequests++;
    });

    ucf.on('icerc-decision', (decision: any) => {
      if (decision.approved) {
        this.metrics.icercApproved++;
      } else {
        this.metrics.icercDenied++;
      }
    });

    // Add metrics command
    ucf.addCommand?.('metrics', () => {
      console.log('\n📊 UCF Metrics:');
      console.log(`Total Messages: ${this.metrics.messagesTotal}`);
      console.log(`  - Catalyst: ${this.metrics.messagesByCatalyst}`);
      console.log(`  - Forge: ${this.metrics.messagesByForge}`);
      console.log(`ICERC Requests: ${this.metrics.icercRequests}`);
      console.log(`  - Approved: ${this.metrics.icercApproved}`);
      console.log(`  - Denied: ${this.metrics.icercDenied}`);
    });
  }

  getMetrics() {
    return { ...this.metrics };
  }
}

/**
 * Plugin manager for handling plugin lifecycle
 */
export class PluginManager {
  private plugins: Map<string, UCFPlugin> = new Map();

  /**
   * Register a plugin
   */
  register(plugin: UCFPlugin, ucf: any): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin "${plugin.name}" is already registered`);
      return;
    }

    plugin.install(ucf);
    this.plugins.set(plugin.name, plugin);
    console.log(`Plugin "${plugin.name}" v${plugin.version} registered successfully`);
  }

  /**
   * Unregister a plugin
   */
  unregister(pluginName: string, ucf: any): void {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      console.warn(`Plugin "${pluginName}" not found`);
      return;
    }

    if (plugin.uninstall) {
      plugin.uninstall(ucf);
    }
    
    this.plugins.delete(pluginName);
    console.log(`Plugin "${pluginName}" unregistered successfully`);
  }

  /**
   * Get all registered plugins
   */
  getPlugins(): UCFPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get plugin by name
   */
  getPlugin(name: string): UCFPlugin | undefined {
    return this.plugins.get(name);
  }
}

// AI-GENERATED: Forge - Task:RFI-UCF-LITE-20241213-001 - End