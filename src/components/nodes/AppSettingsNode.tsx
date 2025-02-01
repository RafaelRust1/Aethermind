import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import EditableLabel from '../EditableLabel';
import useStore from '../../store/useStore';

interface TechStack {
  id: string;
  name: string;
  files: {
    path: string;
    content: string;
  }[];
  dependencies: {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
}

const techStacks: TechStack[] = [
  {
    id: 'vite-react',
    name: 'Vite + React + TypeScript',
    files: [
      {
        path: 'vite.config.ts',
        content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`
      },
      {
        path: 'tsconfig.json',
        content: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`
      }
    ],
    dependencies: {
      dependencies: {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.22.3"
      },
      devDependencies: {
        "@types/react": "^18.2.56",
        "@types/react-dom": "^18.2.19",
        "@typescript-eslint/eslint-plugin": "^7.0.2",
        "@typescript-eslint/parser": "^7.0.2",
        "@vitejs/plugin-react": "^4.2.1",
        "typescript": "^5.2.2",
        "vite": "^5.1.4"
      }
    }
  }
];

const AppSettingsNode = ({  }: { data: any; id: string }) => {
  const { appSettings: currentSettings, updateAppSettings } = useStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedStack, setSelectedStack] = useState(techStacks[0]);

  const updateSettings = (key: string, value: any) => {
    updateAppSettings({ ...currentSettings, [key]: value });
  };

  const handleTechStackChange = (stackId: string) => {
    const stack = techStacks.find(s => s.id === stackId);
    if (stack) {
      setSelectedStack(stack);
      updateSettings('techStack', stack);
    }
  };

  const iconClass = "h-5 w-5 text-amber-400 flex-shrink-0";
  const itemClass = `flex flex-col p-3 rounded-lg transition-all duration-300 
    ${currentSettings.darkMode 
      ? "bg-gray-800 hover:bg-gray-700" 
      : "bg-white hover:bg-gray-100"} 
    shadow-sm hover:shadow-md`;

  return (
    <div 
      className={`min-w-[400px] h-auto flex flex-col justify-between py-6 px-4 transition-all duration-300 
        ${isExpanded ? 'w-96' : 'w-20'} 
        ${currentSettings.darkMode ? "bg-black" : "bg-gray-100"}
        shadow-lg rounded-lg`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex flex-col items-center space-y-6">
        <div className="flex items-center justify-between w-full drag-handle cursor-move">
          <div className="flex items-center">
            <Settings className={iconClass} />
            <h2 className={`ml-3 text-lg font-semibold ${currentSettings.darkMode ? "text-white" : "text-black"}`}>
              App Settings
            </h2>
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 rounded-full ${currentSettings.darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} hover:bg-amber-400 hover:text-white transition-colors duration-300`}
            aria-label={isExpanded ? "Collapse node" : "Expand node"}
          >
            {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        
        {isExpanded && (
          <div className="space-y-4 w-full">
            <div className={itemClass}>
              <label className="text-sm font-medium mb-2">Tech Stack</label>
              <select
                value={selectedStack.id}
                onChange={(e) => handleTechStackChange(e.target.value)}
                className={`w-full px-3 py-2 rounded-md ${currentSettings.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-black'}`}
              >
                {techStacks.map(stack => (
                  <option key={stack.id} value={stack.id}>{stack.name}</option>
                ))}
              </select>
            </div>

            <div className={itemClass}>
              <label className="text-sm font-medium mb-2">App Name</label>
              <input
                type="text"
                value={currentSettings.name}
                onChange={(e) => updateSettings('name', e.target.value)}
                className={`w-full px-3 py-2 rounded-md ${currentSettings.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-black'}`}
              />
            </div>

            <div className={itemClass}>
              <label className="text-sm font-medium mb-2">App Title</label>
              <input
                type="text"
                value={currentSettings.title}
                onChange={(e) => updateSettings('title', e.target.value)}
                className={`w-full px-3 py-2 rounded-md ${currentSettings.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-black'}`}
              />
            </div>

            <div className={itemClass}>
              <label className="text-sm font-medium mb-2">Description</label>
              <textarea
                value={currentSettings.description}
                onChange={(e) => updateSettings('description', e.target.value)}
                rows={2}
                className={`w-full px-3 py-2 rounded-md ${currentSettings.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-black'}`}
              />
            </div>

            <div className={itemClass}>
              <label className="text-sm font-medium mb-2">Icon Path</label>
              <input
                type="text"
                value={currentSettings.icon}
                onChange={(e) => updateSettings('icon', e.target.value)}
                className={`w-full px-3 py-2 rounded-md ${currentSettings.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-black'}`}
              />
            </div>

            <div className={itemClass}>
              <label className="text-sm font-medium mb-2">Primary Color</label>
              <input
                type="color"
                value={currentSettings.theme.primary}
                onChange={(e) => updateSettings('theme', { ...currentSettings.theme, primary: e.target.value })}
                className="w-full h-8 rounded-md cursor-pointer"
              />
            </div>

            <div className={itemClass}>
              <label className="text-sm font-medium mb-2">Secondary Color</label>
              <input
                type="color"
                value={currentSettings.theme.secondary}
                onChange={(e) => updateSettings('theme', { ...currentSettings.theme, secondary: e.target.value })}
                className="w-full h-8 rounded-md cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default AppSettingsNode;