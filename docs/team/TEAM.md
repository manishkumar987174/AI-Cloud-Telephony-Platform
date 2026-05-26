# Team Structure & Responsibilities

| Member | Role | Primary Tasks |
|--------|------|--------------|
| Member 1 | Frontend Lead | Pages, UI components, routing, Redux, design system |
| Member 2 | Frontend + WebRTC | SIP.js integration, browser calling, audio controls |
| Member 3 | Backend APIs | REST APIs, controllers, models, auth, validation |
| Member 4 | Backend Real-time + AI | Socket.IO, ESL, AI pipeline (STT/LLM/TTS), jobs |
| Member 5 | Database + Billing | MongoDB schemas, billing logic, transactions, reports |
| Member 6 | DevOps + Telephony | Kamailio, FreeSWITCH, coturn, Docker, CI/CD |
| Member 7 | QA + Documentation | Testing, load tests, API docs, onboarding guides |

## Git Branches
| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `frontend-dev` | Frontend development |
| `backend-dev` | Backend development |
| `telephony-dev` | Telephony configs |
| `ai-dev` | AI features |

## PR Rules
- All PRs require 1 reviewer
- Must pass CI before merge
- Link related issue in PR description