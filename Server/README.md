```
Pawscribe-v2-server/
│
├── app/
│   ├── __init__.py      # App initialization
│   ├── models/          # Data models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── folder.py
│   │   ├── file.py
│   │   └── hash.py
│   ├── routes/          # API routes
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── files.py
│   │   ├── folders.py
│   │   └── hashing.py
│   ├── services/        # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── file_service.py
│   │   ├── folder_service.py
│   │   └── hash_service.py
│   ├── utils/           # Utility functions
│   │   ├── __init__.py
│   │   ├── file_utils.py
│   │   ├── hash_utils.py
│   │   └── auth_utils.py
│   └── config.py        # Configuration settings
│
├── requirements.txt      # Dependencies
├── run.py                # Flask application entry point
└── README.md             # Documentation

```