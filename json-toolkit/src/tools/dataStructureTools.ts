import type { JSONValue, JSONTool, ToolResult } from '../types';
import { isObject, isArray } from '../utils/objectHelper';
import { createErrorResult, createSuccessResult } from '../utils/jsonHelper';

export class FlattenTool implements JSONTool {
  name = 'JSON 扁平化';
  category: 'basic' | 'data_structure' | 'conversion' | 'query' | 'security' = 'data_structure';
  type: 'flatten' = 'flatten';

  execute(input: JSONValue, options?: unknown): ToolResult {
    try {
      const separator = (options as { separator?: string })?.separator ?? '.';
      const flattened = this.flattenObject(input, separator);
      return createSuccessResult(JSON.stringify(flattened, null, 2), { separator });
    } catch (error) {
      return createErrorResult(error instanceof Error ? error.message : '扁平化失败');
    }
  }

  private flattenObject(value: JSONValue, separator: string, prefix: string = ''): Record<string, JSONValue> {
    const result: Record<string, JSONValue> = {};

    if (value === null || typeof value !== 'object') {
      result[prefix] = value;
      return result;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const newKey = prefix ? `${prefix}[${index}]` : `[${index}]`;
        if (isObject(item) || isArray(item)) {
          Object.assign(result, this.flattenObject(item, separator, newKey));
        } else {
          result[newKey] = item;
        }
      });
      return result;
    }

    for (const key of Object.keys(value)) {
      const newKey = prefix ? `${prefix}${separator}${key}` : key;
      const item = (value as Record<string, JSONValue>)[key];

      if (isObject(item) || isArray(item)) {
        Object.assign(result, this.flattenObject(item, separator, newKey));
      } else {
        result[newKey] = item;
      }
    }

    return result;
  }
}

export class UnflattenTool implements JSONTool {
  name = 'JSON 反扁平化';
  category: 'basic' | 'data_structure' | 'conversion' | 'query' | 'security' = 'data_structure';
  type: 'unflatten' = 'unflatten';

  execute(input: JSONValue, options?: unknown): ToolResult {
    try {
      const separator = (options as { separator?: string })?.separator ?? '.';
      const unflattened = this.unflattenObject(input as Record<string, JSONValue>, separator);
      return createSuccessResult(JSON.stringify(unflattened, null, 2), { separator });
    } catch (error) {
      return createErrorResult(error instanceof Error ? error.message : '反扁平化失败');
    }
  }

  private unflattenObject(flat: Record<string, JSONValue>, separator: string): JSONValue {
    const result: Record<string, JSONValue> = {};

    for (const key in flat) {
      if (Object.prototype.hasOwnProperty.call(flat, key)) {
        const keys = key.split(separator);
        let current: Record<string, JSONValue> = result;

        for (let i = 0; i < keys.length - 1; i++) {
          const k = keys[i];

          if (!(k in current) || current[k] === null || typeof current[k] !== 'object') {
            const nextKey = keys[i + 1];
            const isArrayIndex = /^\d+$/.test(nextKey);
            current[k] = isArrayIndex ? [] : {};
          }

          current = current[k] as Record<string, JSONValue>;
        }

        const lastKey = keys[keys.length - 1];
        current[lastKey] = flat[key];
      }
    }

    return result;
  }
}

export class RemoveNullTool implements JSONTool {
  name = '去除 null 字段';
  category: 'basic' | 'data_structure' | 'conversion' | 'query' | 'security' = 'basic';
  type: 'removeNull' = 'removeNull';

  execute(input: JSONValue, options?: unknown): ToolResult {
    try {
      const cleaned = this.removeNullFields(input);
      return createSuccessResult(JSON.stringify(cleaned, null, 2));
    } catch (error) {
      return createErrorResult(error instanceof Error ? error.message : '去除 null 失败');
    }
  }

  private removeNullFields(value: JSONValue): JSONValue {
    if (value === null) {
      return null;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.removeNullFields(item));
    }

    if (isObject(value)) {
      const objValue = value as Record<string, JSONValue>;
      const result: Record<string, JSONValue> = {};

      for (const key of Object.keys(objValue)) {
        const item = objValue[key];

        if (item === null) {
          continue;
        }

        if (isObject(item) || Array.isArray(item)) {
          result[key] = this.removeNullFields(item);
        } else {
          result[key] = item;
        }
      }

      return result;
    }

    return value;
  }
}

export class RemoveEmptyStringTool implements JSONTool {
  name = '去除空字符串字段';
  category: 'basic' | 'data_structure' | 'conversion' | 'query' | 'security' = 'basic';
  type: 'removeEmptyString' = 'removeEmptyString';

  execute(input: JSONValue, options?: unknown): ToolResult {
    try {
      const cleaned = this.removeEmptyStringFields(input);
      return createSuccessResult(JSON.stringify(cleaned, null, 2));
    } catch (error) {
      return createErrorResult(error instanceof Error ? error.message : '去除空字符串失败');
    }
  }

  private removeEmptyStringFields(value: JSONValue): JSONValue {
    if (value === null || typeof value !== 'object') {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.removeEmptyStringFields(item));
    }

    if (isObject(value)) {
      const objValue = value as Record<string, JSONValue>;
      const result: Record<string, JSONValue> = {};

      for (const key of Object.keys(objValue)) {
        const item = objValue[key];

        if (item === '') {
          continue;
        }

        if (isObject(item) || Array.isArray(item)) {
          result[key] = this.removeEmptyStringFields(item);
        } else {
          result[key] = item;
        }
      }

      return result;
    }

    return value;
  }
}
