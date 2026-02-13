import type { JSONValue, JSONTool, ToolResult } from '../types';
import { isObject } from '../utils/objectHelper';
import { createErrorResult, createSuccessResult } from '../utils/jsonHelper';

export class ToTypeScriptTool implements JSONTool {
  name = '转 TypeScript Interface';
  category: 'basic' | 'data_structure' | 'conversion' | 'query' | 'security' = 'conversion';
  type: 'toTypeScript' = 'toTypeScript';

  execute(input: JSONValue, options?: unknown): ToolResult {
    try {
      const interfaceName = (options as { interfaceName?: string })?.interfaceName ?? 'MyType';
      const result = this.generateTypeScriptInterface(input, interfaceName);
      return createSuccessResult(result);
    } catch (error) {
      return createErrorResult(error instanceof Error ? error.message : '转换失败');
    }
  }

  private generateTypeScriptInterface(value: JSONValue, name: string): string {
    const tsType = this.valueToTypeScriptType(value);
    return `export interface ${name} {\n${tsType}\n}`;
  }

  private valueToTypeScriptType(value: JSONValue, indent: number = 1): string {
    const spaces = '  '.repeat(indent);

    if (value === null) {
      return 'null';
    }

    if (typeof value === 'string') {
      return 'string';
    }

    if (typeof value === 'number') {
      return 'number';
    }

    if (typeof value === 'boolean') {
      return 'boolean';
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return 'unknown[]';
      }

      const firstType = this.valueToTypeScriptType(value[0], 0);
      const hasMixedTypes = value.some(item => {
        const itemType = this.valueToTypeScriptType(item, 0);
        return itemType !== firstType;
      });

      if (hasMixedTypes) {
        return 'unknown[]';
      }

      return `${firstType}[]`;
    }

    if (isObject(value)) {
      const objValue = value as Record<string, JSONValue>;
      const properties: string[] = [];

      for (const key of Object.keys(objValue)) {
        const valueType = this.valueToTypeScriptType(objValue[key], indent + 1);

        if (valueType.includes('\n')) {
          properties.push(`${spaces}${key}: {\n${valueType}\n${spaces}};`);
        } else {
          properties.push(`${spaces}${key}: ${valueType};`);
        }
      }

      if (properties.length === 0) {
        return 'Record<string, any>';
      }

      return properties.join('\n');
    }

    return 'any';
  }
}

export class ToJavaTool implements JSONTool {
  name = '转 Java Class';
  category: 'basic' | 'data_structure' | 'conversion' | 'query' | 'security' = 'conversion';
  type: 'toJava' = 'toJava';

  execute(input: JSONValue, options?: unknown): ToolResult {
    try {
      const className = (options as { className?: string })?.className ?? 'MyClass';
      const result = this.generateJavaClass(input, className);
      return createSuccessResult(result);
    } catch (error) {
      return createErrorResult(error instanceof Error ? error.message : '转换失败');
    }
  }

  private generateJavaClass(value: JSONValue, className: string): string {
    const fields = this.valueToJavaFields(value, 1);
    return `public class ${className} {\n${fields}\n}`;
  }

  private valueToJavaFields(value: JSONValue, indent: number): string {
    const spaces = '  '.repeat(indent);

    if (!isObject(value)) {
      return '';
    }

    const objValue = value as Record<string, JSONValue>;
    const fields: string[] = [];

    for (const key of Object.keys(objValue)) {
      const javaType = this.valueToJavaType(objValue[key]);
      const fieldName = this.toSnakeCase(key);
      fields.push(`${spaces}private ${javaType} ${fieldName};`);
    }

    return fields.join('\n');
  }

  private valueToJavaType(value: JSONValue): string {
    if (value === null) return 'Object';

    if (typeof value === 'string') return 'String';

    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'Integer' : 'Double';
    }

    if (typeof value === 'boolean') return 'Boolean';

    if (Array.isArray(value)) {
      if (value.length === 0) return 'List<Object>';
      const elementType = this.valueToJavaType(value[0]);
      return `List<${elementType}>`;
    }

    if (isObject(value)) {
      return 'Object';
    }

    return 'Object';
  }

  private toSnakeCase(str: string): string {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
  }
}

export class ToGoTool implements JSONTool {
  name = '转 Go Struct';
  category: 'basic' | 'data_structure' | 'conversion' | 'query' | 'security' = 'conversion';
  type: 'toGo' = 'toGo';

  execute(input: JSONValue, options?: unknown): ToolResult {
    try {
      const structName = (options as { structName?: string })?.structName ?? 'MyStruct';
      const result = this.generateGoStruct(input, structName);
      return createSuccessResult(result);
    } catch (error) {
      return createErrorResult(error instanceof Error ? error.message : '转换失败');
    }
  }

  private generateGoStruct(value: JSONValue, structName: string): string {
    const fields = this.valueToGoFields(value, 1);
    return `type ${structName} struct {\n${fields}\n}`;
  }

  private valueToGoFields(value: JSONValue, indent: number): string {
    const spaces = '  '.repeat(indent);

    if (!isObject(value)) {
      return '';
    }

    const objValue = value as Record<string, JSONValue>;
    const fields: string[] = [];

    for (const key of Object.keys(objValue)) {
      const goType = this.valueToGoType(objValue[key]);
      const fieldName = this.toPascalCase(key);
      fields.push(`${spaces}${fieldName} ${goType} \`json:"${key}"\``);
    }

    return fields.join('\n');
  }

  private valueToGoType(value: JSONValue): string {
    if (value === null) return 'any';

    if (typeof value === 'string') return 'string';

    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'int' : 'float64';
    }

    if (typeof value === 'boolean') return 'bool';

    if (Array.isArray(value)) {
      if (value.length === 0) return '[]any';
      const elementType = this.valueToGoType(value[0]);
      return `[]${elementType}`;
    }

    if (isObject(value)) {
      return 'any';
    }

    return 'any';
  }

  private toPascalCase(str: string): string {
    return str.replace(/(?:^|[-_\s])(\w)/g, (_, c) => c.toUpperCase());
  }
}
