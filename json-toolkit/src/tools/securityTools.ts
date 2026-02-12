import type { JSONValue, JSONTool, ToolResult } from '../types';
import { isArray, isObject } from '../utils/objectHelper';
import { createErrorResult, createSuccessResult } from '../utils/jsonHelper';

export class MaskFieldsTool implements JSONTool {
  name = '字段脱敏';
  category: 'basic' | 'data_structure' | 'conversion' | 'query' | 'security' = 'security';
  type: 'maskFields' = 'maskFields';

  execute(input: JSONValue, options?: unknown): ToolResult {
    try {
      const masked = this.maskSensitiveFields(input);
      return createSuccessResult(JSON.stringify(masked, null, 2));
    } catch (error) {
      return createErrorResult(error instanceof Error ? error.message : '字段脱敏失败');
    }
  }

  private maskSensitiveFields(value: JSONValue): JSONValue {
    if (value === null || typeof value !== 'object') {
      if (typeof value === 'string') {
        return this.maskSensitiveValue(value);
      }
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.maskSensitiveFields(item));
    }

    if (isObject(value)) {
      const result: Record<string, JSONValue> = {};

      for (const key of Object.keys(value)) {
        const item = value[key];

        if (this.isSensitiveKey(key)) {
          result[key] = this.maskSensitiveValue(item as string);
        } else if (isObject(item) || Array.isArray(item)) {
          result[key] = this.maskSensitiveFields(item);
        } else if (typeof item === 'string') {
          result[key] = this.maskSensitiveValue(item);
        } else {
          result[key] = item;
        }
      }

      return result;
    }

    return value;
  }

  private isSensitiveKey(key: string): boolean {
    const sensitiveKeywords = [
      'phone',
      'mobile',
      'tel',
      'telephone',
      'email',
      'email_address',
      'mail',
      'id_card',
      'idcard',
      'identity',
      'id_number',
      'ssn',
      'social_security',
      'password',
      'pwd',
      'secret',
      'token',
      'api_key',
      'apikey',
      'credit_card',
      'card_number',
      'cvv',
      'bank_account',
      'account_number',
    ];

    const lowerKey = key.toLowerCase();

    return sensitiveKeywords.some((keyword) => lowerKey.includes(keyword));
  }

  private maskSensitiveValue(value: string): string {
    if (!value) {
      return value;
    }

    if (this.isEmail(value)) {
      return this.maskEmail(value);
    }

    if (this.isPhone(value)) {
      return this.maskPhone(value);
    }

    if (this.isIdCard(value)) {
      return this.maskIdCard(value);
    }

    return this.maskGeneric(value);
  }

  private isEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  private maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');

    if (localPart.length <= 2) {
      return `${localPart[0]}***@${domain}`;
    }

    return `${localPart.substring(0, 2)}***@${domain}`;
  }

  private isPhone(value: string): boolean {
    return /^\d{11}$/.test(value) || /^\+?\d{10,15}$/.test(value);
  }

  private maskPhone(phone: string): string {
    if (phone.length >= 7) {
      return `${phone.substring(0, 3)}****${phone.substring(phone.length - 4)}`;
    }

    return '****';
  }

  private isIdCard(value: string): boolean {
    return /^\d{15}$|^\d{18}$/.test(value);
  }

  private maskIdCard(idCard: string): string {
    if (idCard.length >= 8) {
      return `${idCard.substring(0, 4)}********${idCard.substring(idCard.length - 4)}`;
    }

    return '****';
  }

  private maskGeneric(value: string): string {
    if (value.length <= 4) {
      return '****';
    }

    return `${value.substring(0, 2)}${'*'.repeat(value.length - 4)}${value.substring(value.length - 2)}`;
  }
}

export class DeleteFieldsTool implements JSONTool {
  name = '删除字段';
  category: 'basic' | 'data_structure' | 'conversion' | 'query' | 'security' = 'security';
  type: 'deleteFields' = 'deleteFields';

  execute(input: JSONValue, options?: unknown): ToolResult {
    try {
      const optionsObj = options as { fields?: string[] } || {};
      const fieldsToDelete = optionsObj.fields;

      if (!fieldsToDelete || fieldsToDelete.length === 0) {
        return createErrorResult('请提供要删除的字段列表');
      }

      const result = this.deleteFields(input, fieldsToDelete);
      return createSuccessResult(JSON.stringify(result, null, 2));
    } catch (error) {
      return createErrorResult(error instanceof Error ? error.message : '删除字段失败');
    }
  }

  private deleteFields(value: JSONValue, fieldsToDelete: string[]): JSONValue {
    if (value === null || typeof value !== 'object') {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.deleteFields(item, fieldsToDelete));
    }

    if (isObject(value)) {
      const result: Record<string, JSONValue> = {};

      for (const key of Object.keys(value)) {
        if (fieldsToDelete.includes(key)) {
          continue;
        }

        const item = value[key];

        if (isObject(item) || Array.isArray(item)) {
          result[key] = this.deleteFields(item, fieldsToDelete);
        } else {
          result[key] = item;
        }
      }

      return result;
    }

    return value;
  }
}
