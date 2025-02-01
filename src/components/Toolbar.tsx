import React, { useState } from "react";
import { FileCode, Download, X, Moon, Sun, ChevronDown, ChevronUp } from "lucide-react";
import JSZip from "jszip";
import useStore from "../store/useStore";

const Toolbar = () => {
  const {
    generateFiles,
    generatedFiles,
    appSettings,
    toggleDarkMode,
    toggleToolbar,
    isToolbarOpen,
  } = useStore();
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const downloadFiles = async () => {
    const zip = new JSZip();

    // Add project configuration files
  
// Constants for configuration files
const packageJsonContent = {
  name: appSettings.name,
  private: true,
  version: "0.0.0",
  type: "module",
  scripts: {
    dev: "vite",
    build: "tsc && vite build",
    lint: "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    preview: "vite preview"
  },
  dependencies: {
    react: "^18.2.0",
    "react-dom": "^18.2.0",
    zustand: "^4.5.2",
    "@types/node": "^20.11.24",
    tailwindcss: "^3.4.1",
    autoprefixer: "^10.4.18",
    postcss: "^8.4.35"
  },
  devDependencies: {
    "@types/react": "^18.2.56",
    "@types/react-dom": "^18.2.19",
    "@typescript-eslint/eslint-plugin": "^7.0.2",
    "@typescript-eslint/parser": "^7.0.2",
    "@vitejs/plugin-react": "^4.2.1",
    eslint: "^8.56.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    typescript: "^5.2.2",
    vite: "^5.1.4"
  }
};

const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="${appSettings.icon}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${appSettings.title}</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;

const tsconfigContent = {
  compilerOptions: {
    target: "ES2020",
    useDefineForClassFields: true,
    lib: ["ES2020", "DOM", "DOM.Iterable"],
    module: "ESNext",
    skipLibCheck: true,
    moduleResolution: "bundler",
    allowImportingTsExtensions: true,
    resolveJsonModule: true,
    isolatedModules: true,
    noEmit: true,
    jsx: "react-jsx",
    strict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noFallthroughCasesInSwitch: true
  },
  include: ["src"],
  references: [{ path: "./tsconfig.node.json" }]
};

const tsconfigNodeContent = {
  compilerOptions: {
    composite: true,
    skipLibCheck: true,
    module: "ESNext",
    moduleResolution: "bundler",
    allowSyntheticDefaultImports: true
  },
  include: ["vite.config.ts"]
};

const viteConfigContent = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});`;

const postcssConfigContent = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`;

const tailwindConfigContent = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};`;

// Add project configuration files
zip.file('package.json', JSON.stringify(packageJsonContent, null, 2));
zip.file('index.html', indexHtmlContent);
zip.file('tsconfig.json', JSON.stringify(tsconfigContent, null, 2));
zip.file('tsconfig.node.json', JSON.stringify(tsconfigNodeContent, null, 2));
zip.file('vite.config.ts', viteConfigContent);
zip.file('postcss.config.js', postcssConfigContent);
zip.file('tailwind.config.js', tailwindConfigContent);

    // Add source files
    const srcFolder = zip.folder("src");
    if (srcFolder) {
      srcFolder.file(
        "main.tsx",
        `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
      );

      srcFolder.file(
        "index.css",
        `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary-color: ${appSettings.theme.primary};
  --secondary-color: ${appSettings.theme.secondary};
}

.dark {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
}

.light {
  --bg-primary: #ffffff;
  --text-primary: #000000;
}`
      );

      // Add generated component files
      Object.entries(generatedFiles).forEach(([path, code]) => {
        const [folder, filename] = path.split("/");
        const componentFolder = srcFolder.folder(folder);
        if (componentFolder) {
          componentFolder.file(filename, code);
        }
      });
    }

    const content = await zip.generateAsync({ type: "blob" });
    const url = window.URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${appSettings.name}.zip`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };
  const handleClick = () => {
    generateFiles();
    setIsToolbarVisible(true);
  };
  const buttonClass = `
  flex items-center px-4 py-2 rounded-lg transition-all duration-300
  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
`;

const iconClass = "w-5 h-5";

return (
  <div className={`
    bg-white dark:bg-black text-black dark:text-white px-2 py-2  rounded-xl shadow-xl
    transition-all duration-300 ease-in-out
    ${appSettings.darkMode ? "dark" : ""}
  `}>
    <div className="flex items-center justify-between gap-4 ">
      <div className="flex gap-4">
        <button
          onClick={handleClick}
          className={`${buttonClass} bg-green-500 hover:bg-green-600 text-white`}
        >
          <FileCode className={`${iconClass} mr-2`} />
          Generate Code
        </button>
        {Object.keys(generatedFiles).length > 0 && (
          <button
            onClick={downloadFiles}
            className={`${buttonClass} bg-blue-500 hover:bg-blue-600 text-white`}
          >
            <Download className={`${iconClass} mr-2`} />
            Download Project
          </button>
        )}
      </div>
      <div className="flex gap-3">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300`}
          aria-label={appSettings.darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {appSettings.darkMode ? <Sun className={iconClass} /> : <Moon className={iconClass} />}
        </button>
      
      </div>
    </div>
    
    {Object.keys(generatedFiles).length > 0 && (
      <div className="mt-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            flex items-center justify-between w-full p-3 rounded-lg
            bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
            transition-colors duration-200
          `}
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Generated Files</h3>
          {isExpanded ? <ChevronUp className={iconClass} /> : <ChevronDown className={iconClass} />}
        </button>
        {isExpanded && (
          <div className="mt-3 max-h-96 overflow-y-auto space-y-3 custom-scrollbar">
            {Object.entries(generatedFiles).map(([path, code]) => (
              <div key={path} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-2">{path}</h4>
                <pre className="text-sm overflow-x-auto p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  <code className="text-gray-800 dark:text-gray-200">{code.slice(0, 100)}...</code>
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);
};

export default Toolbar;
 
