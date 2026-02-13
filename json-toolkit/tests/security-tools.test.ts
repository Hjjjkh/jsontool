import { describe, it, expect } from 'vitest';
import { MaskFieldsTool, DeleteFieldsTool } from '../src/tools/securityTools';

describe('安全工具测试', () => {
  describe('MaskFieldsTool - 字段脱敏', () => {
    it('应该脱敏 email 字段', () => {
      const tool = new MaskFieldsTool();
      const result = tool.execute({ email: 'test@example.com' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.email).toContain('***');
      expect(parsed.email).toContain('@example.com');
    });

    it('应该脱敏 phone 字段', () => {
      const tool = new MaskFieldsTool();
      const result = tool.execute({ phone: '13800138000' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.phone).toBe('138****8000');
    });

    it('应该脱敏 id_card 字段', () => {
      const tool = new MaskFieldsTool();
      const result = tool.execute({ id_card: '123456789012345678' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.id_card).toBe('1234********5678');
    });

    it('应该脱敏 password 字段', () => {
      const tool = new MaskFieldsTool();
      const result = tool.execute({ password: 'secret123' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.password).toContain('*');
    });

    it('应该脱敏 token 字段', () => {
      const tool = new MaskFieldsTool();
      const result = tool.execute({ token: 'abc123def456' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.token).toContain('*');
    });

    it('应该脱敏 api_key 字段', () => {
      const tool = new MaskFieldsTool();
      const result = tool.execute({ api_key: 'sk-123456' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.api_key).toContain('*');
    });

    it('应该脱敏 credit_card 字段', () => {
      const tool = new MaskFieldsTool();
      const result = tool.execute({ credit_card: '1234567890123456' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.credit_card).toContain('*');
    });

    it('应该递归脱敏嵌套对象', () => {
      const tool = new MaskFieldsTool();
      const result = tool.execute(
        { profile: { email: 'test@example.com' } }
      );
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.profile.email).toContain('***');
    });

    it('应该脱敏数组中的对象', () => {
      const tool = new MaskFieldsTool();
      const result = tool.execute(
        { users: [{ email: 'test@example.com' }] }
      );
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.users[0].email).toContain('***');
    });

    it('应该脱敏多个敏感字段', () => {
      const tool = new MaskFieldsTool();
      const result = tool.execute({
        email: 'test@example.com',
        phone: '13800138000',
        name: '张三'
      });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.email).toContain('***');
      expect(parsed.phone).toContain('****');
      expect(parsed.name).toBe('张三');
    });

    it('应该不脱敏普通字段', () => {
      const tool = new MaskFieldsTool();
      const result = tool.execute({ name: '张三', age: 25 });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.name).toBe('张三');
      expect(parsed.age).toBe(25);
    });

    it('应该不脱敏非敏感字段的字符串', () => {
      const tool = new MaskFieldsTool();
      const result = tool.execute({ description: '这是一个描述' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.description).toBe('这是一个描述');
    });

    it('应该处理短 email', () => {
      const tool = new MaskFieldsTool();
      const result = tool.execute({ email: 'a@b.com' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.email).toContain('***');
    });

    it('应该处理带区号的电话', () => {
      const tool = new MaskFieldsTool();
      const result = tool.execute({ phone: '+8613800138000' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.phone).toContain('****');
    });

    it('应该处理短电话', () => {
      const tool = new MaskFieldsTool();
      const result = tool.execute({ phone: '123456' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.phone).toBe('12**56');
    });

    it('应该处理 15 位身份证', () => {
      const tool = new MaskFieldsTool();
      const result = tool.execute({ id_card: '123456789012345' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.id_card).toContain('****');
    });

    it('应该处理短身份证', () => {
      const tool = new MaskFieldsTool();
      const result = tool.execute({ id_card: '1234567' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.id_card).toBe('12***67');
    });

    it('应该处理空字符串', () => {
      const tool = new MaskFieldsTool();
      const result = tool.execute({ email: '' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.email).toBe('');
    });

    it('应该处理 null 值', () => {
      const tool = new MaskFieldsTool();
      const result = tool.execute({ email: null });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.email).toBeNull();
    });

    it('应该处理空对象', () => {
      const tool = new MaskFieldsTool();
      const result = tool.execute({});
      expect(result.success).toBe(true);
      expect(result.result).toBe('{}');
    });

    it('应该不脱敏数字', () => {
      const tool = new MaskFieldsTool();
      const result = tool.execute({ phone: 123456789 });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.phone).toBe(123456789);
    });
  });

  describe('DeleteFieldsTool - 删除字段', () => {
    it('应该删除指定的字段', () => {
      const tool = new DeleteFieldsTool();
      const result = tool.execute({ a: 1, b: 2, c: 3 }, { fields: ['b'] });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed).toEqual({ a: 1, c: 3 });
    });

    it('应该删除多个字段', () => {
      const tool = new DeleteFieldsTool();
      const result = tool.execute(
        { a: 1, b: 2, c: 3 },
        { fields: ['a', 'c'] }
      );
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed).toEqual({ b: 2 });
    });

    it('应该递归删除嵌套对象的字段', () => {
      const tool = new DeleteFieldsTool();
      const result = tool.execute(
        { profile: { a: 1, b: 2 } },
        { fields: ['b'] }
      );
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.profile).toEqual({ a: 1 });
    });

    it('应该删除数组中的对象字段', () => {
      const tool = new DeleteFieldsTool();
      const result = tool.execute(
        { items: [{ a: 1, b: 2 }] },
        { fields: ['b'] }
      );
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.items[0]).toEqual({ a: 1 });
    });

    it('应该处理不存在的字段', () => {
      const tool = new DeleteFieldsTool();
      const result = tool.execute({ a: 1 }, { fields: ['b'] });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed).toEqual({ a: 1 });
    });

    it('应该处理空对象', () => {
      const tool = new DeleteFieldsTool();
      const result = tool.execute({}, { fields: ['a'] });
      expect(result.success).toBe(true);
      expect(result.result).toBe('{}');
    });

    it('应该删除所有指定字段', () => {
      const tool = new DeleteFieldsTool();
      const result = tool.execute(
        { a: 1, b: 2, c: { a: 3, b: 4 } },
        { fields: ['a', 'b'] }
      );
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed).toEqual({ c: {} });
    });

    it('应该保持非对象类型', () => {
      const tool = new DeleteFieldsTool();
      const result = tool.execute('test', { fields: ['a'] });
      expect(result.success).toBe(true);
      expect(result.result).toBe('"test"');
    });

    it('应该保持数组', () => {
      const tool = new DeleteFieldsTool();
      const result = tool.execute([1, 2, 3], { fields: ['a'] });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toEqual([1, 2, 3]);
    });

    it('应该要求 fields 参数', () => {
      const tool = new DeleteFieldsTool();
      const result = tool.execute({ a: 1 });
      expect(result.success).toBe(false);
      expect(result.error).toBe('请提供要删除的字段列表');
    });

    it('应该处理空数组', () => {
      const tool = new DeleteFieldsTool();
      const result = tool.execute({ a: 1 }, { fields: [] });
      expect(result.success).toBe(false);
      expect(result.error).toBe('请提供要删除的字段列表');
    });

    it('应该处理 null 值', () => {
      const tool = new DeleteFieldsTool();
      const result = tool.execute(null, { fields: ['a'] });
      expect(result.success).toBe(true);
      expect(result.result).toBe('null');
    });
  });
});
