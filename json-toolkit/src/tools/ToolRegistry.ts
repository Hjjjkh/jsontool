import type { JSONTool, ToolResult, JSONValue, ToolType } from '../types';
import { FormatTool, MinifyTool, ValidateTool, SortKeysTool } from './basicTools';
import { FlattenTool, UnflattenTool, RemoveNullTool, RemoveEmptyStringTool } from './dataStructureTools';
import { ToTypeScriptTool, ToJavaTool, ToGoTool } from './conversionTools';

class ToolRegistry {
  private tools: Map<ToolType, JSONTool> = new Map();

  constructor() {
    this.registerDefaultTools();
  }

  private registerDefaultTools(): void {
    const tools: JSONTool[] = [
      new FormatTool(),
      new MinifyTool(),
      new ValidateTool(),
      new SortKeysTool(),
      new FlattenTool(),
      new UnflattenTool(),
      new RemoveNullTool(),
      new RemoveEmptyStringTool(),
      new ToTypeScriptTool(),
      new ToJavaTool(),
      new ToGoTool(),
    ];

    for (const tool of tools) {
      this.register(tool);
    }
  }

  register(tool: JSONTool): void {
    this.tools.set(tool.type, tool);
  }

  unregister(toolType: ToolType): void {
    this.tools.delete(toolType);
  }

  get(toolType: ToolType): JSONTool | undefined {
    return this.tools.get(toolType);
  }

  getAll(): JSONTool[] {
    return Array.from(this.tools.values());
  }

  execute(toolType: ToolType, input: JSONValue | string, options?: unknown): ToolResult {
    const tool = this.get(toolType);

    if (!tool) {
      return {
        success: false,
        error: `工具 ${toolType} 未注册`,
      };
    }

    try {
      return tool.execute(input, options);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '工具执行失败',
      };
    }
  }

  has(toolType: ToolType): boolean {
    return this.tools.has(toolType);
  }
}

export const toolRegistry = new ToolRegistry();
