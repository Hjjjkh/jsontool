import { describe, it, expect } from 'vitest';
import { ToPythonTool, ToSchemaTool } from '../src/tools/conversionAdditionalTools';

describe('转换附加工具测试', () => {
  describe('ToPythonTool - 转 Python Dataclass', () => {
    it('应该生成简单的 dataclass', () => {
      const tool = new ToPythonTool();
      const result = tool.execute({ name: 'test', age: 25 });
      expect(result.success).toBe(true);
      expect(result.result).toContain('@dataclass');
      expect(result.result).toContain('class');
      expect(result.result).toContain('name: str');
      expect(result.result).toContain('age: int');
    });

    it('应该包含必要的导入', () => {
      const tool = new ToPythonTool();
      const result = tool.execute({ name: 'test' });
      expect(result.success).toBe(true);
      expect(result.result).toContain('from dataclasses import dataclass');
      expect(result.result).toContain('from typing import');
    });

    it('应该将字段名转换为下划线命名', () => {
      const tool = new ToPythonTool();
      const result = tool.execute({ userName: 'test' });
      expect(result.success).toBe(true);
      expect(result.result).toContain('user_name: str');
    });

    it('应该生成数组类型', () => {
      const tool = new ToPythonTool();
      const result = tool.execute({ items: [1,2,3] });
      expect(result.success).toBe(true);
      expect(result.result).toContain('items: List[int]');
    });

    it('应该生成空数组类型', () => {
      const tool = new ToPythonTool();
      const result = tool.execute({ items: [] });
      expect(result.success).toBe(true);
      expect(result.result).toContain('items: List[Any]');
    });

    it('应该生成布尔类型', () => {
      const tool = new ToPythonTool();
      const result = tool.execute({ active: true });
      expect(result.success).toBe(true);
      expect(result.result).toContain('active: bool');
    });

    it('应该生成浮点数类型', () => {
      const tool = new ToPythonTool();
      const result = tool.execute({ price: 99.99 });
      expect(result.success).toBe(true);
      expect(result.result).toContain('price: float');
    });

    it('应该为嵌套对象生成 Dict 类型', () => {
      const tool = new ToPythonTool();
      const result = tool.execute({ profile: { name: 'test' } });
      expect(result.success).toBe(true);
      expect(result.result).toContain('profile: Dict[str, Any]');
    });

    it('应该为 null 生成 Any | None', () => {
      const tool = new ToPythonTool();
      const result = tool.execute({ value: null });
      expect(result.success).toBe(true);
      expect(result.result).toContain('value: Any | None = None');
    });

    it('应该支持自定义 class 名称', () => {
      const tool = new ToPythonTool();
      const result = tool.execute({ name: 'test' }, { className: 'User' });
      expect(result.success).toBe(true);
      expect(result.result).toContain('class User');
    });

    it('应该处理空对象', () => {
      const tool = new ToPythonTool();
      const result = tool.execute({});
      expect(result.success).toBe(true);
      expect(result.result).toContain('@dataclass');
      expect(result.result).toContain('class');
    });
  });

  describe('ToSchemaTool - 转 JSON Schema', () => {
    it('应该生成简单的 object schema', () => {
      const tool = new ToSchemaTool();
      const result = tool.execute({ name: 'test', age: 25 });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.type).toBe('object');
      expect(parsed.properties.name.type).toBe('string');
      expect(parsed.properties.age.type).toBe('integer');
    });

    it('应该生成 string 类型', () => {
      const tool = new ToSchemaTool();
      const result = tool.execute({ name: 'test' });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.properties.name.type).toBe('string');
    });

    it('应该生成 number 类型', () => {
      const tool = new ToSchemaTool();
      const result = tool.execute({ price: 99.99 });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.properties.price.type).toBe('number');
    });

    it('应该生成 integer 类型', () => {
      const tool = new ToSchemaTool();
      const result = tool.execute({ count:100 });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.properties.count.type).toBe('integer');
    });

    it('应该生成 boolean 类型', () => {
      const tool = new ToSchemaTool();
      const result = tool.execute({ active: true });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.properties.active.type).toBe('boolean');
    });

    it('应该生成 null 类型', () => {
      const tool = new ToSchemaTool();
      const result = tool.execute({ value: null });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.properties.value.type).toBe('null');
    });

    it('应该生成 array 类型', () => {
      const tool = new ToSchemaTool();
      const result = tool.execute({ items: [1, 2, 3] });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.properties.items.type).toBe('array');
      expect(parsed.properties.items.items.type).toBe('integer');
    });

    it('应该生成空数组类型', () => {
      const tool = new ToSchemaTool();
      const result = tool.execute({ items: [] });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.properties.items.type).toBe('array');
      expect(typeof parsed.properties.items.items).toBe('object');
    });

    it('应该生成嵌套对象类型', () => {
      const tool = new ToSchemaTool();
      const result = tool.execute({ profile: { name: 'test' } });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.properties.profile.type).toBe('object');
      expect(parsed.properties.profile.properties.name.type).toBe('string');
    });

    it('应该生成嵌套数组类型', () => {
      const tool = new ToSchemaTool();
      const result = tool.execute({ matrix: [[1, 2], [3, 4]] });
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.properties.matrix.type).toBe('array');
      expect(parsed.properties.matrix.items.type).toBe('array');
      expect(parsed.properties.matrix.items.items.type).toBe('integer');
    });

    it('应该处理空对象', () => {
      const tool = new ToSchemaTool();
      const result = tool.execute({});
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.type).toBe('object');
      expect(parsed.properties).toEqual({});
    });

    it('应该处理纯数组', () => {
      const tool = new ToSchemaTool();
      const result = tool.execute([1, 2, 3]);
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.type).toBe('array');
      expect(parsed.items.type).toBe('integer');
    });

    it('应该处理纯值', () => {
      const tool = new ToSchemaTool();
      const result = tool.execute('test');
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.type).toBe('string');
    });

    it('应该处理 null', () => {
      const tool = new ToSchemaTool();
      const result = tool.execute(null);
      expect(result.success).toBe(true);
      const parsed = JSON.parse(result.result || '{}');
      expect(parsed.type).toBe('null');
    });
  });
});
