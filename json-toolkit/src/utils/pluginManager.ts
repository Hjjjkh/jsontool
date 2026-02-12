export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  author?: string;
}

export interface Plugin {
  manifest: PluginManifest;
  install: (registry: any) => void;
  uninstall?: (registry: any) => void;
}

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private registry: any;

  constructor(registry: any) {
    this.registry = registry;
  }

  register(plugin: Plugin): void {
    const { name } = plugin.manifest;

    if (this.plugins.has(name)) {
      throw new Error(`插件 ${name} 已存在`);
    }

    plugin.install(this.registry);
    this.plugins.set(name, plugin);
  }

  unregister(name: string): void {
    const plugin = this.plugins.get(name);

    if (!plugin) {
      throw new Error(`插件 ${name} 未找到`);
    }

    if (plugin.uninstall) {
      plugin.uninstall(this.registry);
    }

    this.plugins.delete(name);
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }
}
