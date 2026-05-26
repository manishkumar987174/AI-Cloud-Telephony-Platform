# FreeSWITCH Configuration

## Role
- Media handling for all calls
- IVR execution
- Call recording
- Queue management
- ESL events to Node.js

## Directory Structure
- `conf/dialplan/` — Call routing rules
- `conf/sip_profiles/` — SIP trunk/profile configs
- `conf/autoload_configs/` — Module configs
- `scripts/` — Lua/JavaScript scripts for dynamic logic

## Key Ports
- 5080 UDP/TCP — External SIP
- 5060 UDP/TCP — Internal SIP
- 8021 TCP — ESL (Event Socket Layer)
- 16384-32768 UDP — RTP Media

## Setup
1. Install FreeSWITCH from official repo
2. Copy configs to /etc/freeswitch/
3. Update gateway credentials in external.xml
4. Restart: `systemctl restart freeswitch`