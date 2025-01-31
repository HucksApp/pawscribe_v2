import jsLogo from '../images/icons/js.svg';
import jsxLogo from '../images/icons/jsx.svg';
import tsLogo from '../images/icons/ts.svg';
import htmlLogo from '../images/icons/html.svg';
import cssLogo from '../images/icons/css.svg';
import pyLogo from '../images/icons/py.svg';
import cLogo from '../images/icons/c.svg';
import cppLogo from '../images/icons/cpp.svg';
import javaLogo from '../images/icons/java.svg';
import rubyLogo from '../images/icons/ruby.svg';
import {
  JavaScriptOutlined,
  Html5Filled,
  PythonOutlined,
  JavaOutlined,
  RubyOutlined,
  DotNetOutlined,
    FileTextFilled,
    FileMarkdownFilled,
    FilePdfFilled,
    FileZipFilled,
    FileExcelFilled,
    FileUnknownFilled,
    FileImageFilled,
    FileWordFilled,
    FilePptFilled,
    CodeFilled
  } from "@ant-design/icons";


export default class FileUtility{
    static fileIcon(filename) {
    const extension = FileUtility.getFileExtension(filename)
    console.log(extension, filename)
        let Icon = null;
        let isImg = false;
    
        switch (extension) {
          case "js":
            Icon = jsLogo;
            isImg = true;
            break;
          case "ts":
            Icon = tsLogo;
            isImg = true;
            break;
          case "jsx":
            Icon = jsxLogo;
            isImg = true;
            break;
          case "html":
            Icon =  Html5Filled;
            isImg = false;
            break;
          case "css":
            Icon = cssLogo;
            isImg = true;
            break;
          case "py":
            Icon = PythonOutlined;
            isImg = false ;
            break;
          case "c":
            Icon = cLogo;
            isImg = true;
            break;
          case "cpp":
            Icon = cppLogo;
            isImg = true;
            break;
          case "java":
            Icon = JavaOutlined;
            isImg = false;
            break;
          case "rb":
            Icon = RubyOutlined;
            isImg = false;
            break;
          case "jpg":
          case "jpeg":
          case "png":
          case "gif":
          case "bmp":
          case "webp":
          case "tiff":
            Icon = FileImageFilled;
            isImg = false; // Image files are React components but need to be rendered differently
            break;
          case "pdf":
            Icon = FilePdfFilled;
            isImg = false;
            break;
          case "zip":
          case "rar":
          case "7z":
          case "tar":
          case "gz":
            Icon = FileZipFilled;
            isImg = false;
            break;
          case "xls":
          case "xlsx":
          case "csv":
            Icon = FileExcelFilled;
            isImg = false;
            break;
          case "doc":
          case "docx":
            Icon = FileWordFilled;
            isImg = false;
            break;
          case "ppt":
          case "pptx":
            Icon = FilePptFilled;
            isImg = false;
            break;
          case "sh":
          Icon = CodeFilled;
          isImg = false;
          break;
          case "md":
            Icon = FileMarkdownFilled;
            isImg = false;
            break;
          case "txt":
            Icon = FileTextFilled;
            isImg = false;
            break;
          default:
            Icon = FileUnknownFilled;
            isImg = false;
            break;
        }
    
        return { Icon, isImg };
      }

     static getFileExtension (fileName) {
        if (!fileName || typeof fileName !== "string") return null;
        const parts = fileName.split(".");
        return parts.length > 1 ? parts.pop().toLowerCase() : null;
      }


    static editorLang  (type) {
        switch (type) {
          case 'js':
          case 'ts':
          case 'jsx':
          case 'tsx': // TypeScript JSX
            return 'javascript';
          case 'html':
            return 'html';
          case 'py':
            return 'python';
          case 'c':
            return 'c';
          case 'cpp':
            return 'cpp';
          case 'css':
            return 'css';
          case 'java':
            return 'java';
          case 'rb':
            return 'ruby';
          case 'json':
            return 'json';
          case 'sql':
            return 'sql';
          case 'go':
            return 'go';
          case 'md':
            return 'markdown';
          case 'yaml':
          case 'yml':
            return 'yaml';
          case 'bash':
          case 'sh':
            return 'shell';
          case 'php':
            return 'php';
          case 'r':
            return 'r';
          case 'swift':
            return 'swift';
          case 'kotlin':
            return 'kotlin';
          case 'dart':
            return 'dart';
          case 'scala':
            return 'scala';
          case 'lua':
            return 'lua';
          case 'typescriptreact':
            return 'typescriptreact'; // For .tsx files
          case 'javascriptreact':
            return 'javascriptreact'; // For .jsx files
          default:
            return;
        }
      };
      
}