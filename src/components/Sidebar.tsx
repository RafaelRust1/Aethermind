import React, { useState } from "react";
import {
  Database,
  Command,
  Settings,
  Route,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import useStore from "../store/useStore";

const TopNavbar = () => {
  const { appSettings } = useStore();
  const [isExpanded, setIsExpanded] = useState(true);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const iconClass = "h-5 w-5 text-green-400 flex-shrink-0";
  const itemClass = `flex items-center p-3 rounded-lg cursor-move transition-all duration-300 
    ${
      appSettings.darkMode
        ? "bg-gray-800 hover:bg-gray-700"
        : "bg-white hover:bg-gray-100"
    } 
    shadow-sm hover:shadow-md`;

  return (
    <nav
      className={`w-full transition-all py-4 duration-300 ${
        isExpanded ? "h-28" : "h-24"
      } ${appSettings.darkMode ? "bg-black" : "bg-gray-400"}`}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center space-x-4">
            <img
              src={
                appSettings.darkMode
                  ? "https://i.postimg.cc/L5bH9D0d/logo-for-dark-bg.png"
                  : "https://i.postimg.cc/Pf3fQff6/logo-for-light-bg.png"
              }
              alt="Logo"
              className="  py-12 w-48 object-contain"
            />
       
          </div>
          
          {isExpanded && (
            <div className="flex space-x-4">
              <div
                className={itemClass}
                draggable
                onDragStart={(e) => onDragStart(e, "model")}
              >
                <Database className={iconClass} />
                <span
                  className={`ml-2 ${
                    appSettings.darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Agent
                </span>
              </div>
              <div
                className={itemClass}
                draggable
                onDragStart={(e) => onDragStart(e, "controller")}
              >
                <Command className={iconClass} />
                <span
                  className={`ml-2 ${
                    appSettings.darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Tuner
                </span>
              </div>
              <div
                className={itemClass}
                draggable
                onDragStart={(e) => onDragStart(e, "router")}
              >
                <Route className={iconClass} />
                <span
                  className={`ml-2 ${
                    appSettings.darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Routes
                </span>
              </div>
              <div
                className={itemClass}
                draggable
                onDragStart={(e) => onDragStart(e, "app-settings")}
              >
                <Settings className={iconClass} />
                <span
                  className={`ml-2 ${
                    appSettings.darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Settings
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/RafaelRust1/Aethermind/"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-medium ${
                appSettings.darkMode ? "text-green-400" : "text-green-600"
              } hover:underline`}
            >
              v 1.4
            </a>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-2 rounded-full ${
                appSettings.darkMode
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-800"
              } hover:bg-green-400 hover:text-white transition-colors duration-300`}
              aria-label={isExpanded ? "Collapse navbar" : "Expand navbar"}
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
