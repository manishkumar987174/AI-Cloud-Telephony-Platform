# AI Cloud Telephony Platform

A cloud-based AI telephony SaaS platform with browser calling, auto dialer, IVR, voice broadcasting, call recording, live dashboard, AI voice calling, multi-tenant support, billing, and analytics.

## Architecture
`
React Frontend → Node.js Backend → Redis + MongoDB
                                 → Kamailio SIP Proxy → FreeSWITCH → SIP Trunk → PSTN
                                 → AI Layer (Deepgram + OpenAI + ElevenLabs)
`

## Project Structure
- \/frontend\ — React.js SPA
- \/backend\  — Node.js + Express REST API + Socket.IO
- \/telephony\ — Kamailio, FreeSWITCH, coturn configs
- \/devops\   — Docker, Kubernetes, Monitoring
- \/docs\     — Documentation
- \/tests\    — Unit, Integration, E2E, Load tests
- \/shared\   — Shared types and constants
- \/scripts\  — Utility scripts

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React.js + Tailwind CSS + Redux Toolkit |
| Backend | Node.js + Express + Socket.IO |
| Database | MongoDB + Redis |
| SIP Proxy | Kamailio |
| Media Server | FreeSWITCH |
| WebRTC | SIP.js / JsSIP |
| AI STT | Deepgram |
| AI Brain | OpenAI GPT |
| AI TTS | ElevenLabs |
| Storage | AWS S3 |
| Queue | RabbitMQ |
| Monitoring | Grafana + Prometheus |
| Deployment | Docker + Kubernetes |

## Quick Start
See [docs/setup/README.md](docs/setup/README.md) for setup instructions.

## Team
See [docs/team/TEAM.md](docs/team/TEAM.md) for team roles and responsibilities.

## License
MIT
