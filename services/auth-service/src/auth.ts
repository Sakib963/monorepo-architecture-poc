import { User } from '@monorepo/types';

// Simple token generation for POC - not production secure!
export const generateToken = (user: User): string => {
  const payload = {
    userId: user.userId,
    role: user.role,
    timestamp: Date.now(),
  };

  // In production, use proper JWT library
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

export const verifyToken = (token: string): { userId: string; role: string } | null => {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    
    // In production, verify signature and expiry
    if (payload.userId && payload.role) {
      return {
        userId: payload.userId,
        role: payload.role,
      };
    }
    
    return null;
  } catch (error) {
    return null;
  }
};
