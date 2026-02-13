import type { JSONValue, JSONTool, ToolResult } from '../types';
import { isArray, isObject } from '../utils/objectHelper';
import { createErrorResult, createSuccessResult } from '../utils/jsonHelper';

export class JsonPathTool implements JSONTool {
  name = 'JSON Path 查询';
  category: 'basic' | 'data_structure' | 'conversion' | 'query' | 'security' = 'query';
  type: 'jsonPath' = 'jsonPath';

  execute(input: JSONValue, options?: unknown): ToolResult {
    try {
      const optionsObj = options as { path?: string } || {};
      const path = optionsObj.path;

      if (path === undefined) {
        return createErrorResult('请提供 path 参数');
      }

      const result = this.queryByPath(input, path);
      return createSuccessResult(JSON.stringify(result, null, 2));
    } catch (error) {
      return createErrorResult(error instanceof Error ? error.message : 'JSON Path 查询失败');
    }
  }

  private queryByPath(value: JSONValue, path: string): JSONValue {
    if (!path || path === '') {
      return value;
    }

    const pathParts = this.parsePath(path);
    let current = value;

    for (const part of pathParts) {
      if (current === null || typeof current !== 'object') {
        return null;
      }

      if (Array.isArray(current)) {
        let index = parseInt(part, 10);
        
        if (index < 0) {
          index = current.length + index;
        }
        
        if (!isNaN(index) && index >= 0 && index < current.length) {
          current = current[index];
        } else {
          return null;
        }
      } else if (isObject(current)) {
        const currentObj = current as Record<string, JSONValue>;
        if (part in currentObj) {
          current = currentObj[part];
        } else {
          return null;
        }
      } else {
        return null;
      }
    }

    return current;
  }

  private parsePath(path: string): string[] {
    const parts: string[] = [];
    const regex = /([^.[]+)|\[([^\]]+)\]/g;
    let match;

    while ((match = regex.exec(path)) !== null) {
      if (match[1]) {
        parts.push(match[1]);
      } else if (match[2]) {
        parts.push(match[2]);
      }
    }

    return parts;
  }
}

export class SearchKeyTool implements JSONTool {
  name = '搜索 Key';
  category: 'basic' | 'data_structure' | 'conversion' | 'query' | 'security' = 'query';
  type: 'searchKey' = 'searchKey';

  execute(input: JSONValue, options?: unknown): ToolResult {
    try {
      const optionsObj = options as { keyword?: string } || {};
      const keyword = optionsObj.keyword;

      if (!keyword) {
        return createErrorResult('请提供 keyword 参数');
      }

      const matches = this.searchKeys(input, keyword);
      return createSuccessResult(JSON.stringify(matches, null, 2));
    } catch (error) {
      return createErrorResult(error instanceof Error ? error.message : '搜索 Key 失败');
    }
  }

  private searchKeys(value: JSONValue, keyword: string, path: string = ''): Array<{ path: string; value: JSONValue }> {
    const matches: Array<{ path: string; value: JSONValue }> = [];

    if (value === null || typeof value !== 'object') {
      return matches;
    }

    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const currentPath = `${path}[${i}]`;
        matches.push(...this.searchKeys(value[i], keyword, currentPath));
      }
    } else if (isObject(value)) {
      const objValue = value as Record<string, JSONValue>;
      for (const key of Object.keys(objValue)) {
        const currentPath = path ? `${path}.${key}` : key;

        if (key.toLowerCase().includes(keyword.toLowerCase())) {
          matches.push({
            path: currentPath,
            value: objValue[key],
          });
        }

        matches.push(...this.searchKeys(objValue[key], keyword, currentPath));
      }
    }

    return matches;
  }
}

export class SearchValueTool implements JSONTool {
  name = '搜索值';
  category: 'basic' | 'data_structure' | 'conversion' | 'query' | 'security' = 'query';
  type: 'searchValue' = 'searchValue';

  execute(input: JSONValue, options?: unknown): ToolResult {
    try {
      const optionsObj = options as { keyword?: string } || {};
      const keyword = optionsObj.keyword;

      if (!keyword) {
        return createErrorResult('请提供 keyword 参数');
      }

      const matches = this.searchValues(input, keyword);
      return createSuccessResult(JSON.stringify(matches, null, 2));
    } catch (error) {
      return createErrorResult(error instanceof Error ? error.message : '搜索值失败');
    }
  }

  private searchValues(value: JSONValue, keyword: string, path: string = ''): Array<{ path: string; value: JSONValue }> {
    const matches: Array<{ path: string; value: JSONValue }> = [];

    if (value === null) {
      return matches;
    }

    if (typeof value !== 'object') {
      const valueStr = String(value);

      if (valueStr.toLowerCase().includes(keyword.toLowerCase())) {
        matches.push({ path, value });
      }

      return matches;
    }

    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const currentPath = `${path}[${i}]`;
        matches.push(...this.searchValues(value[i], keyword, currentPath));
      }
    } else if (isObject(value)) {
      const objValue = value as Record<string, JSONValue>;
      for (const key of Object.keys(objValue)) {
        const currentPath = path ? `${path}.${key}` : key;
        matches.push(...this.searchValues(objValue[key], keyword, currentPath));
      }
    }

    return matches;
  }
}
