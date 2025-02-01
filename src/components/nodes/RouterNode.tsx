import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { ChevronLeft, ChevronRight, Route, Wand2 } from 'lucide-react';
import CodeEditor from '../CodeEditor';
import EditableLabel from '../EditableLabel';
import { NodeData } from '../../types';
import { generateCode } from '../../services/ai';
import useStore from '../../store/useStore';

const RouterNode = ({ data, id }: { data: NodeData; id: string }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { appSettings, getRoutes, updateComponent } = useStore();
  const [isExpanded, setIsExpanded] = useState(true);

  const generateRouterCode = async () => {
    setIsGenerating(true);
    try {
      const routes = getRoutes();
      
      if (routes.length === 0) {
        alert('Please add and connect some controllers first');
        return;
      }

      const prompt = `
        Generate a React Router configuration with these routes:
        ${JSON.stringify(routes, null, 2)}
        
        Requirements:
        1. Use React Router v6
        2. Create a beautiful navigation layout with Tailwind CSS
        3. Include proper TypeScript types
        4. Add loading and error boundaries
        5. Support dark mode
        6. Use these theme colors: primary=${appSettings.theme.primary}, secondary=${appSettings.theme.secondary}
        
        Important:
        - Import components from proper relative paths
        - Include all necessary imports
        - Create a complete, production-ready router configuration
      `;

      const generatedCode = await generateCode(prompt);
      data.onCodeChange?.(generatedCode);
      updateComponent(id, { name: 'AppRouter' });
    } catch (error) {
      console.error('Error generating router code:', error);
      alert('Failed to generate code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const iconClass = "h-5 w-5 text-green-400 flex-shrink-0";
  const itemClass = `flex items-center p-3 rounded-lg transition-all duration-300 
    ${appSettings.darkMode 
      ? "bg-gray-800 hover:bg-gray-700" 
      : "bg-white hover:bg-gray-100"} 
    shadow-sm hover:shadow-md`;

  return (
    <div 
      className={`min-w-[400px] h-auto flex flex-col justify-between py-6 px-4 transition-all duration-300 
        ${isExpanded ? 'w-96' : 'w-20'} 
        ${appSettings.darkMode ? "bg-black" : "bg-gray-100"}
        shadow-lg rounded-lg`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex flex-col items-center space-y-6">
        <div className="flex items-center justify-between w-full drag-handle cursor-move">
          <div className="flex items-center">
            <Route className={iconClass} />
            <EditableLabel
              value={data.label}
              onChange={(newLabel) => updateComponent(id, { name: newLabel })}
              nodeId={id}
              className={`ml-3 text-lg font-semibold ${appSettings.darkMode ? "text-white" : "text-black"}`}
            />
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 rounded-full ${appSettings.darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} hover:bg-green-400 hover:text-white transition-colors duration-300`}
            aria-label={isExpanded ? "Collapse node" : "Expand node"}
          >
            {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        
        {isExpanded && (
          <div className="space-y-4 w-full">
            <div className={itemClass}>
              <h4 className={`text-sm font-medium ${appSettings.darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Available Routes</h4>
              {getRoutes().map((route, index) => (
                <div key={index} className={`text-sm font-mono ${appSettings.darkMode ? 'text-gray-300' : 'text-gray-700'} mt-1`}>
                  {route.path} → {route.component}
                </div>
              ))}
            </div>

            <button
              onClick={generateRouterCode}
              disabled={isGenerating}
              className={`${itemClass} justify-center ${
                isGenerating
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500'
                  : 'bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700'
              }`}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Router'}
            </button>

            <div className={itemClass}>
              <h4 className={`text-sm font-medium ${appSettings.darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Generated Router</h4>
              <CodeEditor
                code={data.component.code}
                onChange={(code) => data.onCodeChange?.(code)}
                placeholder="Generated router code will appear here..."
                height="h-32"
              />
            </div>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};
 

export default RouterNode;