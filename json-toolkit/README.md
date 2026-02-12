# JSON 工具站

一个基于 React + TypeScript + Vite 的工程化 JSON 处理工具站。

## 技术栈

- React 18
- TypeScript 5
- Vite 5
- 函数组件 + Hooks
- 严格类型检查（无 any）

## 项目结构

```
src/
  components/          # UI 组件
    Editor.tsx         # JSON 编辑器
    ToolTabs.tsx       # 工具选项卡
    OutputPanel.tsx    # 输出面板
    CopyButton.tsx     # 复制按钮
    DownloadButton.tsx # 下载按钮

  tools/               # 工具模块
    basicTools.ts      # 基础工具（格式化、压缩、校验、排序）
    dataStructureTools.ts # 数据结构工具（扁平化、合并、去重等）
    conversionTools.ts  # 转换工具（TS、Java、Go、Python）
    ToolRegistry.ts    # 工具注册表

  utils/               # 工具函数
    jsonHelper.ts      # JSON 辅助函数
    objectHelper.ts    # 对象处理函数
    pluginManager.ts   # 插件管理器
    pluginHelper.ts    # 插件辅助函数

  types/               # 类型定义
    index.ts           # 核心类型

  hooks/               # 自定义 Hooks
    useToolExecution.ts # 工具执行 Hook

  constants/           # 常量
    index.ts           # 工具菜单项、分类等
```

## 核心特性

### 1. 模块化架构
- UI 组件与业务逻辑严格分离
- 工具模块独立封装
- 可扩展的插件系统

### 2. 类型安全
- 完整的 TypeScript 类型定义
- 递归类型（JSONValue、JSONObject、JSONArray）
- 无 any 类型，使用联合类型

### 3. 工具插件化
每个工具实现统一接口：

```typescript
interface JSONTool {
  name: string
  category: ToolCategory
  type: ToolType
  execute(input: JSONValue, options?: unknown): ToolResult
}
```

### 4. 纯函数设计
所有工具函数都是纯函数，无副作用
易于测试和维护

## 已实现工具

### 基础处理
- ✅ JSON 格式化（支持自定义缩进）
- ✅ JSON 压缩
- ✅ JSON 校验（返回错误行号）
- ✅ 递归 Key 排序（升序/降序）
- ✅ 去除 null 字段
- ✅ 去除空字符串字段

### 数据结构
- ✅ JSON 扁平化（a.b.c 结构）
- ✅ 反扁平化

### 转换
- ✅ JSON → TypeScript Interface
- ✅ JSON → Java Class
- ✅ JSON → Go Struct

## 扩展新工具

1. 在 `src/tools/` 中创建新的工具文件
2. 实现 `JSONTool` 接口
3. 在 `ToolRegistry` 中注册工具
4. 在 `src/constants/index.ts` 中添加菜单项

示例：

```typescript
// 新建 src/tools/customTools.ts
export class CustomTool implements JSONTool {
  name = '自定义工具'
  category = 'basic' as const
  type = 'custom' as const

  execute(input: JSONValue, options?: unknown): ToolResult {
    // 实现逻辑
    return createSuccessResult(JSON.stringify(result))
  }
}
```

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 类型检查
npm run type-check

# 代码检查
npm run lint
```

## 代码规范

- 单个文件不超过 300 行
- 所有异常必须被捕获并返回结构化错误
- 函数必须有完整 TypeScript 类型声明
- 使用函数组件 + Hooks，不使用 class 组件

## 插件系统

支持动态插件加载：

```typescript
import { pluginManager } from './utils/pluginManager';

pluginManager.register({
  manifest: {
    name: 'my-plugin',
    version: '1.0.0',
    description: '我的自定义插件',
  },
  install: (registry) => {
    registry.register(new CustomTool());
  }
});
```
