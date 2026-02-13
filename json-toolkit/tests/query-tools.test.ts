import { describe, it, expect } from 'vitest';
import { JsonPathTool, SearchKeyTool, SearchValueTool } from '../src/tools/queryTools';

describe('查询工具测试', () => {
  describe('JsonPathTool - JSON Path 查询', () => {
    it('应该查询简单路径', () => {
      const tool = new JsonPathTool();
      const result = tool.execute({ a: { b: { c: 1 } } }, { path: 'a.b.c' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || 'null');
      expect(parsed).toBe(1);
    });

    it('应该查询数组索引', () => {
      const tool = new JsonPathTool();
      const result = tool.execute({ items: [1, 2, 3] }, { path: 'items[1]' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || 'null');
      expect(parsed).toBe(2);
    });

    it('应该查询嵌套数组', () => {
      const tool = new JsonPathTool();
      const result = tool.execute({ a: [{ b: 1 }] }, { path: 'a[0].b' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || 'null');
      expect(parsed).toBe(1);
    });

    it('应该处理不存在的路径', () => {
      const tool = new JsonPathTool();
      const result = tool.execute({ a: 1 }, { path: 'b.c' });
      expect(result.success).toBe(true);
      expect(result.result).toBe('null');
    });

    it('应该处理不存在的数组索引', () => {
      const tool = new JsonPathTool();
      const result = tool.execute({ items: [1, 2] }, { path: 'items[5]' });
      expect(result.success).toBe(true);
      expect(result.result).toBe('null');
    });

    it('应该处理空路径', () => {
      const tool = new JsonPathTool();
      const result = tool.execute({ a: 1 }, { path: '' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || 'null');
      expect(parsed).toEqual({ a: 1 });
    });

    it('应该查询根对象', () => {
      const tool = new JsonPathTool();
      const result = tool.execute({ a: 1 }, { path: 'a' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || 'null');
      expect(parsed).toBe(1);
    });

    it('应该处理负数索引', () => {
      const tool = new JsonPathTool();
      const result = tool.execute({ items: [1, 2, 3] }, { path: 'items[-1]' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || 'null');
      expect(parsed).toBe(3);
    });

    it('应该要求 path 参数', () => {
      const tool = new JsonPathTool();
      const result = tool.execute({ a: 1 });
      expect(result.success).toBe(false);
      expect(result.error).toContain('path');
    });

    it('应该处理多层嵌套', () => {
      const tool = new JsonPathTool();
      const result = tool.execute(
        { a: { b: { c: { d: { e: 1 } } } } },
        { path: 'a.b.c.d.e' }
      );
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || 'null');
      expect(parsed).toBe(1);
    });

    it('应该处理包含点号的键', () => {
      const tool = new JsonPathTool();
      const result = tool.execute({ 'a.b': 1 }, { path: 'a.b' });
      expect(result.success).toBe(true);
      expect(result.result).toBe('null');
    });
  });

  describe('SearchKeyTool - 搜索 Key', () => {
    it('应该搜索匹配的键', () => {
      const tool = new SearchKeyTool();
      const result = tool.execute({ name: 'test', age: 25 }, { keyword: 'name' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toHaveLength(1);
      expect(parsed[0].path).toBe('name');
      expect(parsed[0].value).toBe('test');
    });

    it('应该不区分大小写搜索', () => {
      const tool = new SearchKeyTool();
      const result = tool.execute({ Name: 'test' }, { keyword: 'name' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toHaveLength(1);
    });

    it('应该支持部分匹配', () => {
      const tool = new SearchKeyTool();
      const result = tool.execute({ userName: 'test' }, { keyword: 'name' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toHaveLength(1);
    });

    it('应该递归搜索嵌套对象', () => {
      const tool = new SearchKeyTool();
      const result = tool.execute(
        { profile: { name: 'test' } },
        { keyword: 'name' }
      );
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toHaveLength(1);
      expect(parsed[0].path).toBe('profile.name');
    });

    it('应该搜索数组中的对象', () => {
      const tool = new SearchKeyTool();
      const result = tool.execute(
        { items: [{ name: 'a' }, { name: 'b' }] },
        { keyword: 'name' }
      );
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toHaveLength(2);
    });

    it('应该返回所有匹配', () => {
      const tool = new SearchKeyTool();
      const result = tool.execute(
        { name: 'a', profile: { name: 'b' } },
        { keyword: 'name' }
      );
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toHaveLength(2);
    });

    it('应该处理无匹配结果', () => {
      const tool = new SearchKeyTool();
      const result = tool.execute({ a: 1 }, { keyword: 'name' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toHaveLength(0);
    });

    it('应该要求 keyword 参数', () => {
      const tool = new SearchKeyTool();
      const result = tool.execute({ name: 'test' });
      expect(result.success).toBe(false);
      expect(result.error).toContain('keyword');
    });

  });

  describe('SearchValueTool - 搜索值', () => {
    it('应该搜索匹配的字符串值', () => {
      const tool = new SearchValueTool();
      const result = tool.execute({ name: '张三', age: 25 }, { keyword: '张三' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toHaveLength(1);
      expect(parsed[0].path).toBe('name');
      expect(parsed[0].value).toBe('张三');
    });

    it('应该不区分大小写搜索', () => {
      const tool = new SearchValueTool();
      const result = tool.execute({ name: 'Test' }, { keyword: 'test' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toHaveLength(1);
    });

    it('应该支持部分匹配', () => {
      const tool = new SearchValueTool();
      const result = tool.execute({ email: 'test@example.com' }, { keyword: 'test' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toHaveLength(1);
    });

    it('应该搜索数字值', () => {
      const tool = new SearchValueTool();
      const result = tool.execute({ age: 25 }, { keyword: '25' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toHaveLength(1);
    });

    it('应该搜索布尔值', () => {
      const tool = new SearchValueTool();
      const result = tool.execute({ active: true }, { keyword: 'true' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toHaveLength(1);
    });

    it('应该递归搜索嵌套对象', () => {
      const tool = new SearchValueTool();
      const result = tool.execute(
        { profile: { name: 'test' } },
        { keyword: 'test' }
      );
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toHaveLength(1);
      expect(parsed[0].path).toBe('profile.name');
    });

    it('应该搜索数组中的值', () => {
      const tool = new SearchValueTool();
      const result = tool.execute({ items: ['a', 'b', 'c'] }, { keyword: 'b' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toHaveLength(1);
    });

    it('应该返回所有匹配', () => {
      const tool = new SearchValueTool();
      const result = tool.execute(
        { name: 'test', alias: 'test' },
        { keyword: 'test' }
      );
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toHaveLength(2);
    });

    it('应该处理无匹配结果', () => {
      const tool = new SearchValueTool();
      const result = tool.execute({ name: 'test' }, { keyword: 'none' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toHaveLength(0);
    });

    it('应该搜索 null 值', () => {
      const tool = new SearchValueTool();
      const result = tool.execute({ value: null }, { keyword: 'null' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toHaveLength(0);
    });

    it('应该要求 keyword 参数', () => {
      const tool = new SearchValueTool();
      const result = tool.execute({ name: 'test' });
      expect(result.success).toBe(false);
      expect(result.error).toContain('keyword');
    });

    it('应该处理空对象', () => {
      const tool = new SearchValueTool();
      const result = tool.execute({}, { keyword: 'test' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '[]');
      expect(parsed).toHaveLength(0);
    });
  });
});
