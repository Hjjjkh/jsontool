import type { JSONValue, JSONTool, ToolResult } from '../types';
import { isObject } from '../utils/objectHelper';
import { createErrorResult, createSuccessResult } from '../utils/jsonHelper';

export class ToPythonTool implements JSONTool {
  name = '转 Python Dataclass';
  category: 'basic' | 'data_structure' | 'conversion' | 'query' | 'security' = 'conversion';
  type: 'toPython' = 'toPython';

  execute(input: JSONValue, options?: unknown): ToolResult {
    try {
      const className = (options as { className?: string })?.className ?? 'MyData';
      const result = this.generatePythonDataclass(input, className);
      return createSuccessResult(result);
    } catch (error) {
      return createErrorResult(error instanceof Error ? error.message : '转换失败');
    }
  }

  private generatePythonDataclass(value: JSONValue, className: string): string {
    const fields = this.valueToPythonFields(value, 1);
    return `from dataclasses import dataclass\nfrom typing import Optional, List, Dict, Any\n\n@dataclass\nclass ${className}:\n${fields}`;
  }

  private valueToPythonFields(value: JSONValue, indent: number = 1): string {
    const spaces = '  '.repeat(indent);

    if (!isObject(value)) {
      return '';
    }

    const objValue = value as Record<string, JSONValue>;
    const fields: string[] = [];

    for (const key of Object.keys(objValue)) {
      const pythonType = this.valueToPythonType(objValue[key]);
      const fieldName = this.toSnakeCase(key);
      fields.push(`${spaces}${fieldName}: ${pythonType}`);
    }

    return fields.join('\n');
  }

  private valueToPythonType(value: JSONValue): string {
    if (value === null) return 'Optional[Any] = None';

    if (typeof value === 'string') return 'str';

    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'int' : 'float';
    }

    if (typeof value === 'boolean') return 'bool';

    if (Array.isArray(value)) {
      if (value.length === 0) return 'List[Any]';
      const elementType = this.valueToPythonType(value[0]);
      return `List[${elementType}]`;
    }

    if (isObject(value)) {
      return 'Dict[str, Any]';
    }

    return 'Any';
  }

  private toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (match, offset) => {
      if (offset === 0) {
        return match.toLowerCase();
      }
      return `_${match.toLowerCase()}`;
    });
  }
}

export class ToSchemaTool implements JSONTool {
  name = '转 JSON Schema';
  category: 'basic' | 'data_structure' | 'conversion' | 'query' | 'security' = 'conversion';
  type: 'toSchema' = 'toSchema';

  execute(input: JSONValue, options?: unknown): ToolResult {
    try {
      const schema = this.generateJSONSchema(input);
      return createSuccessResult(JSON.stringify(schema, null, 2));
    } catch (error) {
      return createErrorResult(error instanceof Error ? error.message : '转换失败');
    }
  }

  private generateJSONSchema(value: JSONValue): Record<string, unknown> {
    if (value === null) {
      return { type: 'null' };
    }

    if (typeof value === 'string') {
      return { type: 'string' };
    }

    if (typeof value === 'number') {
      return Number.isInteger(value) ? { type: 'integer' } : { type: 'number' };
    }

    if (typeof value === 'boolean') {
      return { type: 'boolean' };
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return { type: 'array', items: {} };
      }

      return {
        type: 'array',
        items: this.generateJSONSchema(value[0]),
      };
    }

    if (isObject(value)) {
      const properties: Record<string, unknown> = {};

      for (const key of Object.keys(value)) {
        properties[key] = this.generateJSONSchema(value[key]);
      }

      return {
        type: 'object',
        properties,
      };
    }

    return {};
  }
}
