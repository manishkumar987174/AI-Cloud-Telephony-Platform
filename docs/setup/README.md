# Setup Guide

## Prerequisites
- Node.js 20+
- Docker & Docker Compose
- MongoDB 7+
- Redis 7+
- FreeSWITCH 1.10+
- Kamailio 5.x
- coturn

## Quick Start (Docker)
```bash
git clone https://github.com/your-org/ai-cloud-telephony.git
cd ai-cloud-telephony
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit .env files with your credentials
docker-compose up -d
```

## Manual Development Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env
npm run dev
```

## Environment Variables
See [backend/.env.example](../../backend/.env.example) and [frontend/.env.example](../../frontend/.env.example).

## Telephony Setup
See [telephony/kamailio/README.md](../../telephony/kamailio/README.md) and [telephony/freeswitch/README.md](../../telephony/freeswitch/README.md).