import type { JSONValue, JSONTool, ToolResult } from '../types';
import { stringifyJSON, stringifyMinified, createErrorResult, createSuccessResult } from '../utils/jsonHelper';

export class FormatTool implements JSONTool {
  name = 'JSON 格式化';
  category: 'basic' | 'data_structure' | 'conversion' | 'query' | 'security' = 'basic';
  type: 'format' = 'format';

  execute(input: JSONValue, options?: unknown): ToolResult {
    const indent = (options as { indent?: number })?.indent ?? 2;

    try {
      const result = stringifyJSON(input, indent);
      return createSuccessResult(result, { indent });
    } catch (error) {
      return createErrorResult(error instanceof Error ? error.message : '格式化失败');
    }
  }
}

export class MinifyTool implements JSONTool {
  name = 'JSON 压缩';
  category: 'basic' | 'data_structure' | 'conversion' | 'query' | 'security' = 'basic';
  type: 'minify' = 'minify';

  execute(input: JSONValue, options?: unknown): ToolResult {
    try {
      const result = stringifyMinified(input);
      return createSuccessResult(result);
    } catch (error) {
      return createErrorResult(error instanceof Error ? error.message : '压缩失败');
    }
  }
}

export class ValidateTool implements JSONTool {
  name = 'JSON 校验';
  category: 'basic' | 'data_structure' | 'conversion' | 'query' | 'security' = 'basic';
  type: 'validate' = 'validate';

  execute(input: string | JSONValue, options?: unknown): ToolResult {
    const jsonString = typeof input === 'string' ? input : JSON.stringify(input);

    try {
      const parsed = JSON.parse(jsonString);
      return createSuccessResult(JSON.stringify(parsed, null, 2), { valid: true });
    } catch (error) {
      const errorInfo = this.parseError(error);
      return createErrorResult(
        errorInfo.message
      );
    }
  }

  private parseError(error: unknown): { message: string } {
    if (error instanceof SyntaxError) {
      const message = error.message;
      const match = message.match(/position (\d+)/);
      if (match) {
        const position = parseInt(match[1], 10);
        return {
          message: `JSON 语法错误: 位置 ${position}`,
        };
      }
    }
    return {
      message: error instanceof Error ? error.message : '未知错误',
    };
  }
}

export class SortKeysTool implements JSONTool {
  name = '递归 Key 排序';
  category: 'basic' | 'data_structure' | 'conversion' | 'query' | 'security' = 'basic';
  type: 'sortKeys' = 'sortKeys';

  execute(input: JSONValue, options?: unknown): ToolResult {
    try {
      const order = (options as { order?: 'asc' | 'desc' })?.order ?? 'asc';
      const sorted = this.sortObjectKeys(input, order);
      return createSuccessResult(JSON.stringify(sorted, null, 2), { order });
    } catch (error) {
      return createErrorResult(error instanceof Error ? error.message : '排序失败');
    }
  }

  private sortObjectKeys(value: JSONValue, order: 'asc' | 'desc'): JSONValue {
    if (value === null || typeof value !== 'object') {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.sortObjectKeys(item, order));
    }

    const keys = Object.keys(value);
    const sorted: Record<string, JSONValue> = {};

    if (order === 'asc') {
      keys.sort((a, b) => a.localeCompare(b));
    } else {
      keys.sort((a, b) => b.localeCompare(a));
    }

    for (const key of keys) {
      sorted[key] = this.sortObjectKeys(value[key], order);
    }

    return sorted;
  }
}
