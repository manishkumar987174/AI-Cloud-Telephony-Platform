# Kamailio Configuration

## Role
- SIP registration and authentication
- Call routing and load balancing
- WebRTC to SIP bridging

## Files
- `config/kamailio.cfg` — Main Kamailio configuration

## Setup
1. Install Kamailio 5.x
2. Copy config files to /etc/kamailio/
3. Update database credentials
4. Start: `systemctl start kamailio`

## Ports
- UDP/TCP 5060 — SIP
- TLS 5061 — Secure SIP