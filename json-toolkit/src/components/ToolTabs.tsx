import React from 'react';
import { TOOL_MENU_ITEMS, TOOL_CATEGORIES } from '../constants';
import type { ToolType } from '../types';

interface ToolTabsProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
}

export const ToolTabs: React.FC<ToolTabsProps> = ({ activeTool, onToolChange }) => {
  return (
    <div className="tool-tabs">
      {TOOL_CATEGORIES.map((category) => (
        <div key={category.id} className="tool-category">
          <h3 className="category-title">{category.label}</h3>
          <div className="tool-buttons">
            {TOOL_MENU_ITEMS.filter((item) => item.category === category.id).map((item) => (
              <button
                key={item.type}
                onClick={() => onToolChange(item.type)}
                className={`tool-button ${activeTool === item.type ? 'active' : ''}`}
                title={item.description}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
