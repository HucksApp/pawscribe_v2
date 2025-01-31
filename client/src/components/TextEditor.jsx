import React, { useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useEditorThemeProvider } from "../contexts/EditorThemeProvider";
import { langIntellisense, languageModules } from "../plugins/lntellisense.js";
import * as monaco from "monaco-editor";

const TextEditor = () => {
  const { options } = useEditorThemeProvider();
  const monacoInstance = useMonaco();

  useEffect(() => {
    if (monacoInstance) {
      const registerLanguages = () => {
        langIntellisense.forEach((lang) => {
          if (!monaco.languages.getLanguages().some((l) => l.id === lang.id)) {
            monaco.languages.register({ id: lang.id });
            monaco.languages.setMonarchTokensProvider(lang.id, lang.tokenizer);
          }
        });
      };
      // Register custom and default languages
      registerLanguages();
      // Add IntelliSense for JavaScript
      monacoInstance.languages.registerCompletionItemProvider("javascript", {
        provideCompletionItems: () => ({
          suggestions: [
            {
              label: "console.log",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: "console.log(${1:expression});",
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Logs output to the console.",
            },
          ],
        }),
      });
    }
  }, [monacoInstance]);


  useEffect(() => {
    const loadLanguageModule = async () => {
      const loadModule = languageModules[options.language];
      if (loadModule) {
        try {
          await loadModule();
          console.log(`${options.language} support loaded successfully.`);
        } catch (error) {
          console.error(`Failed to load support for ${options.language}:`, error);
        }
      }
    };
  
    loadLanguageModule();
  }, [options.language]);

  return (
    <Editor
      height="80vh"
      language={options.language}
      theme={options.theme}
      options={{
        fontSize: options.fontSize,
        fontWeight: options.fontWeight,
        fontFamily: options.fontFamily,
        wordWrap: "on",
        minimap: { enabled: true },
        automaticLayout: true,
      }}
    />
  );
};

export default TextEditor;
