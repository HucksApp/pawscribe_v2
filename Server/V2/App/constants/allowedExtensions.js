export const textFileExtensions = [
    '.txt',                      // Plain text files
    '.md', '.markdown',          // Markdown files
    '.html', '.htm', '.xhtml',   // HTML files
    '.css', '.scss',             // CSS stylesheets
    '.js', '.ts', '.jsx', '.tsx',// JavaScript and TypeScript files
    '.json',                     // JSON files
    '.xml',                      // XML files
    '.yaml', '.yml',             // YAML configuration files
    '.csv', '.tsv',              // Comma-separated and tab-separated values
    '.log',                      // Log files
    '.ini', '.conf', '.config',  // Configuration files
    '.sh', '.bash', '.zsh',      // Shell scripts
    '.env',                      // Environment configuration files
  
    // Programming language source files
    '.py',                       // Python
    '.java',                     // Java
    '.c', '.cpp', '.h',          // C/C++
    '.cs',                       // C#
    '.rs',                       // Rust
    '.go',                       // Go
    '.rb',                       // Ruby
    '.pl', '.pm',                // Perl
    '.php',                      // PHP
    '.r', '.jl', '.m',           // R, Julia, MATLAB
    '.swift',                    // Swift
    '.kt', '.kts',               // Kotlin
    '.dart',                     // Dart
    '.scala',                    // Scala
    '.lua',                      // Lua
    '.hs',                       // Haskell
    '.erl', '.beam', '.ex', '.exs', // Erlang and Elixir
    '.sql',                      // SQL scripts
    '.tex', '.bib',              // LaTeX files
    '.tsql', '.psql',            // T-SQL and PL/pgSQL
    '.sas', '.spss',             // SAS and SPSS
    '.bat', '.cmd', '.ps1',      // Batch and PowerShell scripts
    '.vb', '.vbs',               // Visual Basic and VBScript
    '.asm', '.s',                // Assembly language
    '.makefile', '.mk',          // Makefiles
    '.gradle',                   // Gradle build scripts
    '.toml', '.ini', '.conf',    // Configuration files
    '.dockerfile', '.dockerignore', // Docker files
    '.gitignore', '.gitattributes', // Git configuration
    '.ipynb'                     // Jupyter Notebook
  ];
  



  

  export const binaryFileExtensions = [
    // Image files
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp', 

    '.ico', '.svg', '.psd', '.ai', '.eps', 
  
    // Audio files
    '.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a', '.wma', '.amr', 
  
    // Video files
    '.mp4', '.avi', '.mkv', '.mov', '.webm', '.wmv', '.flv', '.vob', '.mts',
  
    // Archives and compressed files
    '.pdf', '.zip', '.rar', '.tar', '.gz', '.7z', '.bz2', '.xz', '.tgz', '.lz', '.zst',
  
    // Executables and disk images
    '.exe', '.dll', '.iso', '.msi', '.apk', '.app', '.bat', '.bin', '.sh', '.deb', '.rpm',
  
    // Font files
    '.ttf', '.otf', '.woff', '.woff2', '.eot', '.pfa', '.pfb',
  
    // 3D and CAD files
    '.obj', '.stl', '.fbx', '.blend', '.dae', '.3ds', '.dxf',
  
    // General binary data and database files
    '.dat', '.bin', '.db', '.sqlite', '.db3', '.mdb', '.accdb',
  
    // Game files
    '.pak', '.sav', '.unity3d', '.uasset', '.umap',
  
    // Firmware and system files
    '.sys', '.vhd', '.vmdk', '.img', '.dmg',
  
    // Specialized and miscellaneous binary files
    '.swf', '.crx', '.pfx', '.pem', '.crt', '.key', '.csr',
  ];
  
 export const allowedOrigins = ['http://localhost:3000']; 


  export const binaryFiles = binaryFileExtensions.map(value => value.replace(".", ""))
  export const textFiles = textFileExtensions.map(value => value.replace(".", ""))
  