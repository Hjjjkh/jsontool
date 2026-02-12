import type { JSONTool, ToolType, JSONValue } from '../types';

export interface PluginToolDefinition {
  tool: JSONTool;
  optionsSchema?: Record<string, unknown>;
}

export const createPlugin = (
  name: string,
  tools: PluginToolDefinition[]
): {
  name: string;
  tools: PluginToolDefinition[];
} => {
  return {
    name,
    tools,
  };
};

export const validateToolOptions = (
  tool: JSONTool,
  options?: unknown
): { valid: boolean; errors?: string[] } => {
  return {
    valid: true,
  };
};
