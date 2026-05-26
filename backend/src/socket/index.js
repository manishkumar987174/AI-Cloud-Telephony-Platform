import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import logger from '../utils/logger.js';

let io = null;

const initSocket = (server) => {
  logger.info('Initializing Socket.IO server...');
  
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true
    }
  });

  // Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;

      if (!token) {
        logger.warn('Socket connection rejected: Token missing');
        return next(new Error('Authentication error: Token missing'));
      }

      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this');
      
      // Fetch user from DB
      const user = await prisma.user.findUnique({
        where: { id: BigInt(decoded.id) }
      });

      if (!user) {
        logger.warn(`Socket connection rejected: User not found for ID ${decoded.id}`);
        return next(new Error('Authentication error: User not found'));
      }

      if (!user.isActive) {
        logger.warn(`Socket connection rejected: Suspended user ${user.email}`);
        return next(new Error('Authentication error: Account suspended'));
      }

      // Attach user to socket
      socket.user = user;
      next();
    } catch (error) {
      logger.error('Socket authentication failed: %s', error.message);
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  // Connection Handler
  io.on('connection', (socket) => {
    const user = socket.user;
    const companyIdStr = user.companyId.toString();
    const userIdStr = user.id.toString();

    logger.info(`Socket client connected: User ID ${userIdStr} (Role: ${user.role}) for Company ID ${companyIdStr}`);

    // Join tenant-specific company room for multi-tenant isolation
    socket.join(`company_${companyIdStr}`);
    
    // Join individual agent room
    socket.join(`user_${userIdStr}`);

    // Update Agent Status to Online in DB (if agent)
    updateAgentStatus(user.id, 'online').catch(err => {
      logger.error(`Failed to update agent status to online: ${err.message}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket client disconnected: User ID ${userIdStr} of Company ID ${companyIdStr}`);
      
      // Update Agent Status to Offline in DB
      updateAgentStatus(user.id, 'offline').catch(err => {
        logger.error(`Failed to update agent status to offline: ${err.message}`);
      });
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO is not initialized!');
  }
  return io;
};

/**
 * Update Agent Status in DB
 */
async function updateAgentStatus(agentId, status) {
  try {
    await prisma.agentStatus.upsert({
      where: { agentId: BigInt(agentId) },
      update: { status, updatedAt: new Date() },
      create: { agentId: BigInt(agentId), status }
    });
    
    // Broadcast status change to company
    const user = await prisma.user.findUnique({
      where: { id: BigInt(agentId) },
      select: { companyId: true, name: true, role: true }
    });

    if (user) {
      emitToCompany(user.companyId, 'agent_status_changed', {
        agentId: agentId.toString(),
        name: user.name,
        role: user.role,
        status,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    logger.error(`Error updating agent status: ${error.message}`);
  }
}

/**
 * Emit event to a specific company room
 */
const emitToCompany = (companyId, event, data) => {
  if (!io) {
    logger.warn('Socket.IO not initialized. Cannot emit event.');
    return;
  }
  const companyIdStr = companyId.toString();
  logger.info(`Broadcasting Socket event '${event}' to company_${companyIdStr}`);
  io.to(`company_${companyIdStr}`).emit(event, data);
};

/**
 * Emit event to a specific user/agent room
 */
const emitToUser = (userId, event, data) => {
  if (!io) {
    logger.warn('Socket.IO not initialized. Cannot emit event.');
    return;
  }
  const userIdStr = userId.toString();
  logger.info(`Broadcasting Socket event '${event}' to user_${userIdStr}`);
  io.to(`user_${userIdStr}`).emit(event, data);
};

export {
  initSocket,
  getIO,
  emitToCompany,
  emitToUser
};

