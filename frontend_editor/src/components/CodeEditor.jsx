import React, { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import executeCode from '../api/CodeExecution';
import './CodeEditor.css'; 

const CodeEditor = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// Write your code here');
  const [output, setOutput] = useState('');
  const [version, setVersion] = useState('18.15.0');

  const languageVersions = {
    javascript: '18.15.0',
    python: '3.10.0',
    cpp: '10.2.0',
    java: '15.0.2',
    go: '1.19.0',
    c: '10.2.0',
    sqlite3: '3.36.0',
  };

  const languages = Object.keys(languageVersions);

  // Load code from local storage on component mount
  useEffect(() => {
    const savedCode = localStorage.getItem(language);
    if (savedCode) {
      setCode(savedCode);
    }
  }, [language]);

  const handleLanguageChange = (selectedLang) => {
    // Save current code to local storage
    localStorage.setItem(language, code);
    
    setLanguage(selectedLang);
    setVersion(languageVersions[selectedLang]);
    setCode(''); // Clear code when changing languages
  };

  const handleExecute = async () => {
    if (!version) {
      setOutput('Error: Version is not set');
      return;
    }

    const response = await executeCode(language, version, code);
    if (response.success) {
      setOutput(response.output);
    } else {
      setOutput(response.error);
    }

    // Save the code to local storage every time it's executed
    localStorage.setItem(language, code);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    localStorage.setItem(language, newCode); // Save code to local storage whenever it changes
  };

  return (
    <div className="container">
      <h2>Code Editor</h2>

      <div>
        <label>
          Language:
          <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          Monaco Editor Version:
          <input 
            type="text" 
            readOnly 
            value={version} 
          />
        </label>
      </div>

      <MonacoEditor
        height="500px"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={handleCodeChange} 
      />

      <button onClick={handleExecute}>Run Code</button>

      <h3>Output</h3>
      <pre>{output}</pre>
    </div>
  );
};

export default CodeEditor;
