import { describe, it, expect } from 'vitest';
import { FlattenTool, UnflattenTool, RemoveNullTool, RemoveEmptyStringTool } from '../src/tools/dataStructureTools';

describe('数据结构工具测试', () => {
  describe('FlattenTool - 扁平化', () => {
    it('应该扁平化简单对象', () => {
      const tool = new FlattenTool();
      const result = tool.execute({ a: 1, b: 2 }, { separator: '.' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed).toEqual({ a: 1, b: 2 });
    });

    it('应该扁平化嵌套对象', () => {
      const tool = new FlattenTool();
      const result = tool.execute({ a: { b: { c: 1 } } }, { separator: '.' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed).toEqual({ 'a.b.c': 1 });
    });

    it('应该扁平化数组', () => {
      const tool = new FlattenTool();
      const result = tool.execute([1, 2, 3], { separator: '.' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed).toEqual({ '[0]': 1, '[1]': 2, '[2]': 3 });
    });

    it('应该扁平化嵌套数组', () => {
      const tool = new FlattenTool();
      const result = tool.execute({ a: [1, 2, 3] }, { separator: '.' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed).toEqual({ 'a[0]': 1, 'a[1]': 2, 'a[2]': 3 });
    });

    it('应该保留空数组', () => {
      const tool = new FlattenTool();
      const result = tool.execute({ a: [] }, { separator: '.' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toEqual([]);
    });

    it('应该处理混合嵌套', () => {
      const tool = new FlattenTool();
      const result = tool.execute({ a: [{ b: 1 }] }, { separator: '.' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed['a[0].b']).toBe(1);
    });

    it('应该支持自定义分隔符', () => {
      const tool = new FlattenTool();
      const result = tool.execute({ a: { b: 1 } }, { separator: '_' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed).toHaveProperty('a_b');
    });

    it('应该处理 null 值', () => {
      const tool = new FlattenTool();
      const result = tool.execute({ a: null }, { separator: '.' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toBeNull();
    });

    it('应该处理空对象', () => {
      const tool = new FlattenTool();
      const result = tool.execute({}, { separator: '.' });
      expect(result.success).toBe(true);
      expect(result.result).toBe('{}');
    });

    it('应该处理深度嵌套', () => {
      const tool = new FlattenTool();
      const result = tool.execute({ a: { b: { c: { d: 1 } } } }, { separator: '.' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed).toHaveProperty('a.b.c.d');
    });
  });

  describe('UnflattenTool - 反扁平化', () => {
    it('应该反扁平化简单对象', () => {
      const tool = new UnflattenTool();
      const result = tool.execute({ a: 1, b: 2 }, { separator: '.' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed).toEqual({ a: 1, b: 2 });
    });

    it('应该反扁平化嵌套对象', () => {
      const tool = new UnflattenTool();
      const result = tool.execute({ 'a.b.c': 1 }, { separator: '.' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed).toEqual({ a: { b: { c: 1 } } });
    });

    it('应该反扁平化数组索引', () => {
      const tool = new UnflattenTool();
      const result = tool.execute({ 'a[0]': 1, 'a[1]': 2 }, { separator: '.' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toEqual([1, 2]);
    });

    it('应该处理嵌套数组', () => {
      const tool = new UnflattenTool();
      const result = tool.execute({ 'a[0].b': 1 }, { separator: '.' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toEqual([{ b: 1 }]);
    });

    it('应该支持自定义分隔符', () => {
      const tool = new UnflattenTool();
      const result = tool.execute({ 'a_b': 1 }, { separator: '_' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed).toEqual({ a: { b: 1 } });
    });

    it('应该处理空数组', () => {
      const tool = new UnflattenTool();
      const result = tool.execute({ a: [] }, { separator: '.' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toEqual([]);
    });

    it('应该处理混合键', () => {
      const tool = new UnflattenTool();
      const result = tool.execute({ 'a.b': 1, 'c[0]': 2 }, { separator: '.' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a.b).toBe(1);
      expect(parsed.c[0]).toBe(2);
    });

    it('应该与扁平化对称', () => {
      const flattenTool = new FlattenTool();
      const unflattenTool = new UnflattenTool();

      const original = { a: { b: { c: 1 } }, d: [1, 2, 3] };
      const flattened = JSON.parse(flattenTool.execute(original, { separator: '.' }).result || '{}');
      const unflattened = JSON.parse(unflattenTool.execute(flattened, { separator: '.' }).result || '{}');

      expect(unflattened).toEqual(original);
    });

    it('应该处理稀疏数组', () => {
      const tool = new UnflattenTool();
      const result = tool.execute({ 'a[0]': 1, 'a[2]': 3 }, { separator: '.' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toEqual([1, null, 3]);
    });
  });

  describe('RemoveNullTool - 去除 null 字段', () => {
    it('应该去除顶层 null 字段', () => {
      const tool = new RemoveNullTool();
      const result = tool.execute({ a: 1, b: null, c: 2 });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed).toEqual({ a: 1, c: 2 });
    });

    it('应该递归去除嵌套对象的 null 字段', () => {
      const tool = new RemoveNullTool();
      const result = tool.execute({ a: { b: null, c: 1 } });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toEqual({ c: 1 });
    });

    it('应该处理数组中的 null', () => {
      const tool = new RemoveNullTool();
      const result = tool.execute([1, null, 2]);
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toEqual([1, null, 2]);
    });

    it('应该保持 0 值', () => {
      const tool = new RemoveNullTool();
      const result = tool.execute({ a: 0 });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toBe(0);
    });

    it('应该保持空字符串', () => {
      const tool = new RemoveNullTool();
      const result = tool.execute({ a: '' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toBe('');
    });

    it('应该保持 false 值', () => {
      const tool = new RemoveNullTool();
      const result = tool.execute({ a: false });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toBe(false);
    });

    it('应该保持 undefined 值', () => {
      const tool = new RemoveNullTool();
      const result = tool.execute({ a: undefined });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toBeUndefined();
    });

    it('应该处理空对象', () => {
      const tool = new RemoveNullTool();
      const result = tool.execute({});
      expect(result.success).toBe(true);
      expect(result.result).toBe('{}');
    });

    it('应该处理仅包含 null 的对象', () => {
      const tool = new RemoveNullTool();
      const result = tool.execute({ a: null, b: null });
      expect(result.success).toBe(true);
      expect(result.result).toBe('{}');
    });
  });

  describe('RemoveEmptyStringTool - 去除空字符串字段', () => {
    it('应该去除顶层空字符串字段', () => {
      const tool = new RemoveEmptyStringTool();
      const result = tool.execute({ a: 'test', b: '', c: 'demo' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed).toEqual({ a: 'test', c: 'demo' });
    });

    it('应该递归去除嵌套对象的空字符串', () => {
      const tool = new RemoveEmptyStringTool();
      const result = tool.execute({ a: { b: '', c: 'text' } });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toEqual({ c: 'text' });
    });

    it('应该处理数组中的空字符串', () => {
      const tool = new RemoveEmptyStringTool();
      const result = tool.execute(['a', '', 'b']);
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toEqual(['a', '', 'b']);
    });

    it('应该保持空白字符串', () => {
      const tool = new RemoveEmptyStringTool();
      const result = tool.execute({ a: ' ', b: '\t', c: '\n' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toBe(' ');
      expect(parsed.b).toBe('\t');
      expect(parsed.c).toBe('\n');
    });

    it('应该保持 null 值', () => {
      const tool = new RemoveEmptyStringTool();
      const result = tool.execute({ a: null });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toBeNull();
    });

    it('应该保持 0 值', () => {
      const tool = new RemoveEmptyStringTool();
      const result = tool.execute({ a: 0 });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toBe(0);
    });

    it('应该保持 false 值', () => {
      const tool = new RemoveEmptyStringTool();
      const result = tool.execute({ a: false });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.a).toBe(false);
    });

    it('应该处理空对象', () => {
      const tool = new RemoveEmptyStringTool();
      const result = tool.execute({});
      expect(result.success).toBe(true);
      expect(result.result).toBe('{}');
    });
  });
});
