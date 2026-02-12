import type { JSONValue, JSONTool, ToolResult } from '../types';
import { isArray, isObject, deepEqual } from '../utils/objectHelper';
import { createErrorResult, createSuccessResult } from '../utils/jsonHelper';

export class RemoveUndefinedTool implements JSONTool {
  name = '去除 undefined';
  category: 'basic' | 'data_structure' | 'conversion' | 'query' | 'security' = 'basic';
  type: 'removeUndefined' = 'removeUndefined';

  execute(input: JSONValue, options?: unknown): ToolResult {
    try {
      const cleaned = this.removeUndefinedFields(input);
      return createSuccessResult(JSON.stringify(cleaned, null, 2));
    } catch (error) {
      return createErrorResult(error instanceof Error ? error.message : '去除 undefined 失败');
    }
  }

  private removeUndefinedFields(value: JSONValue): JSONValue {
    if (value === null || typeof value !== 'object') {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.removeUndefinedFields(item));
    }

    if (isObject(value)) {
      const result: Record<string, JSONValue> = {};

      for (const key of Object.keys(value)) {
        const item = value[key];

        if (item === undefined) {
          continue;
        }

        if (isObject(item) || Array.isArray(item)) {
          result[key] = this.removeUndefinedFields(item);
        } else {
          result[key] = item;
        }
      }

      return result;
    }

    return value;
  }
}

export class DeepArrayDeduplicateTool implements JSONTool {
  name = '数组去重';
  category: 'basic' | 'data_structure' | 'conversion' | 'query' | 'security' = 'basic';
  type: 'deepArrayDeduplicate' = 'deepArrayDeduplicate';

  execute(input: JSONValue, options?: unknown): ToolResult {
    try {
      const deduplicated = this.deepDeduplicate(input);
      return createSuccessResult(JSON.stringify(deduplicated, null, 2));
    } catch (error) {
      return createErrorResult(error instanceof Error ? error.message : '数组去重失败');
    }
  }

  private deepDeduplicate(value: JSONValue): JSONValue {
    if (value === null || typeof value !== 'object') {
      return value;
    }

    if (Array.isArray(value)) {
      const result: JSONValue[] = [];

      for (const item of value) {
        const deduplicatedItem = this.deepDeduplicate(item);

        if (!this.containsArray(result, deduplicatedItem)) {
          result.push(deduplicatedItem);
        }
      }

      return result;
    }

    if (isObject(value)) {
      const result: Record<string, JSONValue> = {};

      for (const key of Object.keys(value)) {
        result[key] = this.deepDeduplicate(value[key]);
      }

      return result;
    }

    return value;
  }

  private containsArray(array: JSONValue[], item: JSONValue): boolean {
    return array.some((existing) => deepEqual(existing, item));
  }
}

export class DiffTool implements JSONTool {
  name = '深度比较';
  category: 'basic' | 'data_structure' | 'conversion' | 'query' | 'security' = 'data_structure';
  type: 'diff' = 'diff';

  execute(input: JSONValue, options?: unknown): ToolResult {
    try {
      const optionsObj = options as { compareWith?: string } || {};
      const compareWithStr = optionsObj.compareWith;

      if (!compareWithStr) {
        return createErrorResult('请提供 compareWith 参数');
      }

      const compareWith = JSON.parse(compareWithStr) as JSONValue;
      const diff = this.computeDiff(input, compareWith);
      return createSuccessResult(JSON.stringify(diff, null, 2));
    } catch (error) {
      return createErrorResult(error instanceof Error ? error.message : '深度比较失败');
    }
  }

  private computeDiff(a: JSONValue, b: JSONValue, path: string = ''): Record<string, unknown> {
    if (deepEqual(a, b)) {
      return { unchanged: true };
    }

    if (typeof a !== typeof b) {
      return {
        type: 'type_mismatch',
        path,
        oldValue: a,
        newValue: b,
      };
    }

    if (a === null || b === null || typeof a !== 'object') {
      return {
        type: 'changed',
        path,
        oldValue: a,
        newValue: b,
      };
    }

    if (Array.isArray(a) && Array.isArray(b)) {
      const result: Record<string, unknown> = { type: 'array_diff', path, changes: [] };

      const maxLength = Math.max(a.length, b.length);

      for (let i = 0; i < maxLength; i++) {
        const currentPath = `${path}[${i}]`;

        if (i >= a.length) {
          (result.changes as unknown[]).push({
            type: 'added',
            path: currentPath,
            value: b[i],
          });
        } else if (i >= b.length) {
          (result.changes as unknown[]).push({
            type: 'removed',
            path: currentPath,
            value: a[i],
          });
        } else if (!deepEqual(a[i], b[i])) {
          (result.changes as unknown[]).push({
            type: 'changed',
            path: currentPath,
            oldValue: a[i],
            newValue: b[i],
          });
        }
      }

      return result;
    }

    if (isObject(a) && isObject(b)) {
      const result: Record<string, unknown> = { type: 'object_diff', path, changes: [] };
      const keys = new Set([...Object.keys(a as Record<string, JSONValue>), ...Object.keys(b as Record<string, JSONValue>)]);

      for (const key of keys) {
        const currentPath = path ? `${path}.${key}` : key;
        const objA = a as Record<string, JSONValue>;
        const objB = b as Record<string, JSONValue>;

        if (!(key in objA)) {
          (result.changes as unknown[]).push({
            type: 'added',
            path: currentPath,
            value: objB[key],
          });
        } else if (!(key in objB)) {
          (result.changes as unknown[]).push({
            type: 'removed',
            path: currentPath,
            value: objA[key],
          });
        } else if (!deepEqual(objA[key], objB[key])) {
          (result.changes as unknown[]).push(
            this.computeDiff(objA[key], objB[key], currentPath)
          );
        }
      }

      return result;
    }

    return {
      type: 'changed',
      path,
      oldValue: a,
      newValue: b,
    };
  }
}

export class MergeTool implements JSONTool {
  name = '合并';
  category: 'basic' | 'data_structure' | 'conversion' | 'query' | 'security' = 'data_structure';
  type: 'merge' = 'merge';

  execute(input: JSONValue, options?: unknown): ToolResult {
    try {
      const optionsObj = options as { mergeWith?: string } || {};
      const mergeWithStr = optionsObj.mergeWith;

      if (!mergeWithStr) {
        return createErrorResult('请提供 mergeWith 参数');
      }

      const mergeWith = JSON.parse(mergeWithStr) as JSONValue;
      const merged = this.deepMerge(input, mergeWith);
      return createSuccessResult(JSON.stringify(merged, null, 2));
    } catch (error) {
      return createErrorResult(error instanceof Error ? error.message : '合并失败');
    }
  }

  private deepMerge(target: JSONValue, source: JSONValue): JSONValue {
    if (source === null || typeof source !== 'object') {
      return source;
    }

    if (Array.isArray(source)) {
      return [...source];
    }

    if (isObject(source)) {
      const result: Record<string, JSONValue> = { ...(isObject(target) ? (target as Record<string, JSONValue>) : {}) };

      for (const key of Object.keys(source as Record<string, JSONValue>)) {
        const sourceValue = source[key];

        if (isObject(sourceValue) && isObject((result[key] as JSONValue))) {
          result[key] = this.deepMerge((result[key] as JSONValue), sourceValue);
        } else {
          result[key] = sourceValue;
        }
      }

      return result;
    }

    return source;
  }
}
