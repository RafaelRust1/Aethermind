import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { Command, Wand2, ChevronRight, ChevronLeft } from 'lucide-react';
import CodeEditor from '../CodeEditor';
import EditableLabel from '../EditableLabel';
import { NodeData } from '../../types';
import { generateCode } from '../../services/ai';
import useStore from '../../store/useStore';

const ControllerNode = ({ data, id }: { data: NodeData; id: string }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [customLogic, setCustomLogic] = useState('');
  const { getConnectedNodes, updateComponent, getModelInterfaces, appSettings } = useStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [modelInterfaces, setModelInterfaces] = useState<{ name: string; interface: string }[]>([]);

  useEffect(() => {
    const interfaces = getModelInterfaces(id);
    setModelInterfaces(interfaces);
    
    if (interfaces.length > 0 && !customLogic) {
      const template = interfaces.map(int => `
// Available interface: ${int.interface}

// Example usage:
const [${int.name.toLowerCase()}s, set${int.name}s] = useState<${int.name}[]>([]);

// Add your custom logic here:
`).join('\n');
      
      setCustomLogic(template);
    }
  }, [id, getModelInterfaces]);

  const generateControllerCode = async () => {
    setIsGenerating(true);
    try {
      const connectedModels = getConnectedNodes(id, 'model');

      if (connectedModels.length === 0) {
        alert('Please connect this controller to at least one model first');
        return;
      }

      const modelPromises = connectedModels.map(async (modelNode) => {
        const modelCode = modelNode.data.component.code;
        const interfaceMatch = modelCode.match(/interface\s+(\w+)\s*{[^}]+}/);
        
        if (!interfaceMatch) {
          throw new Error(`No interface found in model: ${modelNode.data.component.name}`);
        }

        return {
          name: interfaceMatch[1],
          interface: interfaceMatch[0],
          code: modelCode,
        };
      });

      const models = await Promise.all(modelPromises);
      const primaryModel = models[0];
      const aiEnhancedName = `AI${primaryModel.name}Controller`;
      updateComponent(id, { name: aiEnhancedName });

      const prompt = `
        Given these model implementations:
        ${models.map(model => model.code).join('\n\n')}
        
        And this custom controller logic:
        ${customLogic}
        
        Generate a TypeScript React controller component that:
        1. Implements the custom logic provided
        2. Integrates with all connected models
        3. Creates a beautiful and responsive UI using Tailwind CSS
        4. Implements proper form handling and validation
        5. Includes loading and error states
        6. Uses proper TypeScript types
        7. Follows best practices and SOLID principles
        8. Is production-ready
        
        Important:
        - Include all necessary imports at the top
        - Import models from '../models/'
        - Import types from '../types'
        - Use proper relative paths
        
        The component should include both the controller logic and the view.
        Return a single file that exports the complete component.
      `;

      const generatedCode = await generateCode(prompt);
      data.onCodeChange?.(generatedCode);
    } catch (error) {
      console.error('Error generating controller code:', error);
      alert('Failed to generate code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
   
  };

  const iconClass = "h-5 w-5 text-purple-400 flex-shrink-0";
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
          <Command className={iconClass} />
          <EditableLabel
            value={data.label}
            onChange={(newLabel) => {
              const aiPrefix = newLabel.startsWith('AI') ? '' : 'AI';
              updateComponent(id, { name: `${aiPrefix}${newLabel}` });
            }}
            nodeId={id}
            className={`ml-3 text-lg font-semibold ${appSettings.darkMode ? "text-white" : "text-black"}`}
          />
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2 rounded-full ${appSettings.darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} hover:bg-purple-400 hover:text-white transition-colors duration-300`}
          aria-label={isExpanded ? "Collapse node" : "Expand node"}
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
        
      </div>

      {isExpanded && (
        <div className="space-y-4 w-full">
          
          {modelInterfaces.length > 0 && (
            <div className={itemClass}>
              <h4 className={`text-sm font-medium ${appSettings.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Available Models</h4>
              {modelInterfaces.map((int, index) => (
                <div key={index} className={`text-sm font-mono ${appSettings.darkMode ? 'text-gray-300' : 'text-gray-700'} mt-1`}>
                  {int.name}
                </div>
              ))}
            </div>
          )}

          <div className={itemClass}>
            <h4 className={`text-sm font-medium ${appSettings.darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Custom Logic</h4>
            <CodeEditor
              code={customLogic}
              onChange={setCustomLogic}
              placeholder="Define your custom logic here..."
              height="h-32"
            />
          </div>

          <div className={itemClass}>
            <h4 className={`text-sm font-medium ${appSettings.darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Generated Component</h4>
            <CodeEditor
              code={data.component.code}
              onChange={(code) => data.onCodeChange?.(code)}
              placeholder="Generated component code will appear here..."
              height="h-32"
            />
          </div>

          <button
            onClick={generateControllerCode}
            disabled={isGenerating}
            className={`${itemClass} justify-center ${
              isGenerating
                ? 'bg-gray-300 dark:bg-gray-700 mx-auto text-gray-500'
                : 'bg-purple-500 dark:bg-purple-600 mx-auto text-white hover:bg-purple-600 dark:hover:bg-purple-700'
            }`}
          >
            <Wand2 className="w-4 h-4   mr-2" />
            {isGenerating ? 'Generating...' : 'Generate Component'}
          </button>
          
        </div>
      )}
      
    </div>
    <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
  </div>
);

  };

export default ControllerNode;
