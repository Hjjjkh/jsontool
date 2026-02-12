import type { JSONTool, ToolResult, JSONValue, ToolType } from '../types';
import { FormatTool, MinifyTool, ValidateTool, SortKeysTool } from './basicTools';
import {
  RemoveUndefinedTool,
  DeepArrayDeduplicateTool,
  DiffTool,
  MergeTool,
} from './basicAdditionalTools';
import { FlattenTool, UnflattenTool, RemoveNullTool, RemoveEmptyStringTool } from './dataStructureTools';
import { ToTypeScriptTool, ToJavaTool, ToGoTool } from './conversionTools';
import { ToPythonTool, ToSchemaTool } from './conversionAdditionalTools';
import { JsonPathTool, SearchKeyTool, SearchValueTool } from './queryTools';
import { MaskFieldsTool, DeleteFieldsTool } from './securityTools';

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
      new RemoveUndefinedTool(),
      new DeepArrayDeduplicateTool(),
      new FlattenTool(),
      new UnflattenTool(),
      new RemoveNullTool(),
      new RemoveEmptyStringTool(),
      new DiffTool(),
      new MergeTool(),
      new ToTypeScriptTool(),
      new ToJavaTool(),
      new ToGoTool(),
      new ToPythonTool(),
      new ToSchemaTool(),
      new JsonPathTool(),
      new SearchKeyTool(),
      new SearchValueTool(),
      new MaskFieldsTool(),
      new DeleteFieldsTool(),
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
