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
    this.setLastInputString(jsonString);

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

      const positionMatch = message.match(/position (\d+)/) ||
                            message.match(/at position (\d+)/);
      const lineMatch = message.match(/line (\d+)/);

      if (positionMatch) {
        const position = parseInt(positionMatch[1], 10);
        const { line, column, context } = this.getErrorContext(message, position);
        
        let errorMsg = `JSON 语法错误（第 ${line} 行，第 ${column} 列）：\n\n`;
        errorMsg += `${message}\n\n`;
        errorMsg += `错误位置：\n${context}`;
        
        return { message: errorMsg };
      }

      if (lineMatch) {
        const line = parseInt(lineMatch[1], 10);
        return {
          message: `JSON 语法错误（第 ${line} 行）：\n${message}`,
        };
      }

      return {
        message: `JSON 语法错误：\n${message}`,
      };
    }

    return {
      message: error instanceof Error ? error.message : '未知错误',
    };
  }

  private getErrorContext(errorMessage: string, position: number): { line: number; column: number; context: string } {
    const inputString = this.getLastInputString();
    if (!inputString) {
      return { line: 1, column: position, context: `  位置 ${position}` };
    }

    const lines = inputString.split('\n');
    let charCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const lineLength = lines[i].length + 1;
      
      if (charCount + lineLength > position) {
        const lineNum = i + 1;
        const columnNum = position - charCount + 1;
        
        const context = [];
        const startLine = Math.max(0, i - 1);
        const endLine = Math.min(lines.length - 1, i + 1);
        
        for (let j = startLine; j <= endLine; j++) {
          const prefix = j === i ? '> ' : '  ';
          context.push(`${prefix}${j + 1}: ${lines[j]}`);
          
          if (j === i) {
            const spaces = String(j + 1).length + 3 + columnNum - 1;
            context.push(`${' '.repeat(spaces)}^`);
          }
        }
        
        return { line: lineNum, column: columnNum, context: context.join('\n') };
      }
      
      charCount += lineLength;
    }

    return { line: 1, column: position, context: `  位置 ${position}` };
  }

  private lastInputString = '';

  private getLastInputString(): string {
    return this.lastInputString;
  }

  public setLastInputString(input: string): void {
    this.lastInputString = input;
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

    const keys = Object.keys(value).slice();
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
