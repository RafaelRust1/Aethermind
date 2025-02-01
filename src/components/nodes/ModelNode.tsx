import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { ChevronLeft, ChevronRight, Database, Wand2 } from 'lucide-react';
import CodeEditor from '../CodeEditor';
import EditableLabel from '../EditableLabel';
import { NodeData } from '../../types';
import { generateCode, generateModelPrompt } from '../../services/ai';
import useStore from '../../store/useStore';

const ModelNode = ({ data, id }: { data: NodeData; id: string }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [interfaceCode, setInterfaceCode] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const { updateComponent, appSettings } = useStore();

  const generateAICode = async () => {
    if (!interfaceCode.trim()) {
      alert('Please define the interface first');
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = generateModelPrompt(interfaceCode);
      const generatedCode = await generateCode(prompt);
      data.onCodeChange?.(`${interfaceCode}\n\n${generatedCode}`);
      
      const interfaceMatch = interfaceCode.match(/interface\s+(\w+)/);
      if (interfaceMatch) {
        const interfaceName = interfaceMatch[1];
        updateComponent(id, { name: `${interfaceName}Model` });
      }
    } catch (error) {
      console.error('Error generating model code:', error);
      alert('Failed to generate code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  const iconClass = "h-5 w-5 text-blue-400 flex-shrink-0";
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
            <Database className={iconClass} />
            <EditableLabel
              value={data.label}
              onChange={(newLabel) => updateComponent(id, { name: newLabel })}
              nodeId={id}
              className={`ml-3 text-lg font-semibold ${appSettings.darkMode ? "text-white" : "text-black"}`}
            />
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 rounded-full ${appSettings.darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} hover:bg-blue-400 hover:text-white transition-colors duration-300`}
            aria-label={isExpanded ? "Collapse node" : "Expand node"}
          >
            {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        
        {isExpanded && (
          <div className="space-y-4 w-full">
            <div className={itemClass}>
              <h4 className={`text-sm font-medium ${appSettings.darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Agent Definition</h4>
              <CodeEditor
                code={interfaceCode}
                onChange={setInterfaceCode}
                placeholder="Define your interface here..."
                height="h-32"
              />
            </div>

            <button
              onClick={generateAICode}
              disabled={isGenerating}
              className={`${itemClass} justify-center ${
                isGenerating
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500'
                  : 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700'
              }`}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Model'}
            </button>

            <div className={itemClass}>
              <h4 className={`text-sm font-medium ${appSettings.darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Generated Model</h4>
              <CodeEditor
                code={data.component.code}
                onChange={(code) => data.onCodeChange?.(code)}
                placeholder="Generated model code will appear here..."
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

export default ModelNode;