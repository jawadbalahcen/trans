ranscendence-root/
├── app/                     # Django application
│   ├── static/              # Static assets (JS, CSS, images)
│   ├── templates/           # HTML templates
│   ├── views/               # Django views
│   ├── models/              # Database models
│   ├── forms/               # Django forms
│   ├── urls.py              # App routing
│   ├── settings.py          # Django settings
│   ├── tests/               # Test cases
│   └── manage.py            # Django management script
├── elk/                     # ELK-specific files and configurations
│   ├── logstash/            # Logstash configuration
│   ├── elasticsearch/       # Elasticsearch configuration
│   └── kibana/              # Kibana configuration
├── nginx/                   # Nginx configuration
│   └── default.conf         # Nginx reverse proxy setup
├── docker-compose.yml       # Docker Compose setup
├── Dockerfile               # Django app container setup
├── requirements.txt         # Python dependencies
└── README.md                # Documentation

