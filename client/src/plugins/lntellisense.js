import "monaco-editor/esm/vs/editor/editor.api";
import "monaco-editor/esm/vs/base/common/marked/marked.js"

export const languageModules = {
  javascript: () => import("monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution"),
  typescript: () => import("monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution"),
  python: () => import("monaco-editor/esm/vs/basic-languages/python/python.contribution"),
  cpp: () => import("monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution"),
  java: () => import("monaco-editor/esm/vs/basic-languages/java/java.contribution"),
  html: () => import("monaco-editor/esm/vs/basic-languages/html/html.contribution"),
  css: () => import("monaco-editor/esm/vs/basic-languages/css/css.contribution"),
  markdown: () => import("monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution"),
  sql: () => import("monaco-editor/esm/vs/basic-languages/sql/sql.contribution"),
  php: () => import("monaco-editor/esm/vs/basic-languages/php/php.contribution"),
  ruby: () => import("monaco-editor/esm/vs/basic-languages/ruby/ruby.contribution"),
  go: () => import("monaco-editor/esm/vs/basic-languages/go/go.contribution"),
  csharp: () => import("monaco-editor/esm/vs/basic-languages/csharp/csharp.contribution"),
  swift: () => import("monaco-editor/esm/vs/basic-languages/swift/swift.contribution"),
  rust: () => import("monaco-editor/esm/vs/basic-languages/rust/rust.contribution"),
  xml: () => import("monaco-editor/esm/vs/basic-languages/xml/xml.contribution"),
  yaml: () => import("monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution"),
  shell: () => import("monaco-editor/esm/vs/basic-languages/shell/shell.contribution"),
  dockerfile: () => import("monaco-editor/esm/vs/basic-languages/dockerfile/dockerfile.contribution"),
  kotlin: () => import("monaco-editor/esm/vs/basic-languages/kotlin/kotlin.contribution"),
};


export const langIntellisense = [
    {
      id: "ruby",
      tokenizer: {
        defaultToken: "invalid",
        tokenPostfix: ".rb",
        keywords: ["def", "end", "if", "else", "elsif", "while", "do", "class", "module"],
        symbols: /[=><!~?:&|+\-*/^%]+/, // Fixed regex
        tokenizer: {
          root: [
            [/[a-zA-Z_]\w*/, {
              cases: {
                "@keywords": "keyword",
                "@default": "identifier",
              },
            }],
            [/#.*$/, "comment"],
            [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
            [/\d+/, "number"],
          ],
          string: [
            [/[^\\"]+/, "string"],
            [/\\./, "string.escape"],
            [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
          ],
        },
      },
    },
    {
      id: "go",
      tokenizer: {
        defaultToken: "invalid",
        tokenPostfix: ".go",
        keywords: ["func", "package", "import", "return", "if", "else", "for", "range", "struct"],
        symbols: /[=><!~?:&|+\-*/^%]+/, // Fixed regex
        tokenizer: {
          root: [
            [/[a-zA-Z_]\w*/, {
              cases: {
                "@keywords": "keyword",
                "@default": "identifier",
              },
            }],
            [/\/\/.*$/, "comment"],
            [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
            [/\d+/, "number"],
          ],
          string: [
            [/[^\\"]+/, "string"],
            [/\\./, "string.escape"],
            [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
          ],
        },
      },
    },
  ];
  