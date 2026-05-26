# API Reference

Base URL: `http://localhost:5000/api`

## Authentication
All endpoints (except `/auth/*`) require:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login |
| GET | /auth/me | Get current user |
| POST | /auth/logout | Logout |

### Campaigns
| Method | Path | Description |
|--------|------|-------------|
| GET | /campaigns | List all campaigns |
| POST | /campaigns | Create campaign |
| GET | /campaigns/:id | Get campaign |
| PUT | /campaigns/:id | Update campaign |
| POST | /campaigns/:id/start | Start campaign |
| POST | /campaigns/:id/stop | Stop campaign |

### Contacts
| Method | Path | Description |
|--------|------|-------------|
| GET | /contacts | List contacts |
| POST | /contacts/upload | Upload CSV/Excel |
| DELETE | /contacts/:id | Delete contact |

### Calls
| Method | Path | Description |
|--------|------|-------------|
| POST | /calls/make | Make outbound call |
| POST | /calls/hangup | Hangup call |
| POST | /calls/transfer | Transfer call |
| GET | /calls | Get call logs |

### Recordings
| Method | Path | Description |
|--------|------|-------------|
| GET | /recordings | List recordings |
| GET | /recordings/:id | Get recording |
| DELETE | /recordings/:id | Delete recording |

### Billing
| Method | Path | Description |
|--------|------|-------------|
| GET | /billing/wallet | Get wallet balance |
| POST | /billing/recharge | Add funds |
| GET | /billing/transactions | Transaction history |