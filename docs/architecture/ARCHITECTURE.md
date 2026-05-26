# System Architecture

## Overview
```
React Frontend (Port 3000)
        |
        | HTTP / WebSocket
        v
Node.js Backend (Port 5000)
        |
   +----+----+
   |         |
MongoDB    Redis
(data)    (cache/sessions)
        |
   +----+----+
   |         |
RabbitMQ   Socket.IO
(jobs)    (real-time)
        |
Kamailio SIP Proxy (Port 5060)
        |
FreeSWITCH Media Server (Port 5080)
        |
   TATA SIP Trunk
        |
   PSTN / Mobile
```

## AI Call Flow
```
Caller Voice
    -> FreeSWITCH (audio stream)
    -> Deepgram STT (speech to text)
    -> OpenAI GPT (generate response)
    -> ElevenLabs TTS (text to speech)
    -> FreeSWITCH (play audio to caller)
```

## Multi-Tenant Isolation
- Every DB query filtered by companyId
- Separate SIP extensions per company
- Separate S3 folder per company for recordings
- Separate billing wallet per company

## Security Layers
1. JWT authentication (API)
2. SIP TLS + SRTP (calls)
3. Rate limiting (API)
4. IP whitelist (admin)
5. Fail2Ban (SIP attacks)