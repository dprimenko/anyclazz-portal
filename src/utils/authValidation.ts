interface TokenPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  aud?: string | string[];
  iss?: string;
  roles?: string[];
  realm_roles?: string[];
  email?: string;
  preferred_username?: string;
}

interface ValidationResult {
  isValid: boolean;
  reason?: string;
  shouldInvalidateSession?: boolean;
}

const accountValidationCache = new Map<string, { 
  isValid: boolean; 
  timestamp: number; 
  expiresIn: number 
}>();

const CACHE_DURATION = 5 * 60 * 1000;

export function validateTokenExpiration(session: any): ValidationResult {
  try {
    if (!session?.accessToken) {
      return { isValid: false, reason: 'No access token found', shouldInvalidateSession: true };
    }
    
    const tokenParts = session.accessToken.split('.');
    if (tokenParts.length !== 3) {
      return { isValid: false, reason: 'Invalid token format', shouldInvalidateSession: true };
    }
    
    let payload: TokenPayload;
    try {
      payload = JSON.parse(atob(tokenParts[1]));
    } catch (decodeError) {
      return { isValid: false, reason: 'Cannot decode token payload', shouldInvalidateSession: true };
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (!payload.exp) {
      return { isValid: false, reason: 'Token has no expiration', shouldInvalidateSession: true };
    }
    
    if (payload.exp < currentTime) {
      const expDate = new Date(payload.exp * 1000);
      console.log(`Token expired at: ${expDate.toISOString()}`);
      return { isValid: false, reason: `Token expired at ${expDate.toISOString()}`, shouldInvalidateSession: true };
    }
    
    if (payload.iat && payload.iat > currentTime + 60) {
      return { isValid: false, reason: 'Token issued in the future', shouldInvalidateSession: true };
    }
    
    if (!payload.sub && !payload.preferred_username) {
      return { isValid: false, reason: 'Token missing user identifier', shouldInvalidateSession: true };
    }
    
    const timeUntilExpiry = payload.exp - currentTime;
    console.log(`Token valid, expires in ${timeUntilExpiry} seconds`);
    
    return { isValid: true };
    
  } catch (error) {
    console.error('Error validating token expiration:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { isValid: false, reason: `Validation error: ${message}`, shouldInvalidateSession: true };
  }
}

export async function validateUserAccount(session: any, forceRefresh: boolean = false): Promise<ValidationResult> {
  try {
    if (!session?.accessToken) {
      return { isValid: false, reason: 'No access token for account validation', shouldInvalidateSession: true };
    }

    const tokenPayload = JSON.parse(atob(session.accessToken.split('.')[1]));
    const userId = tokenPayload.sub || tokenPayload.preferred_username || 'unknown';
    
    if (!forceRefresh && accountValidationCache.has(userId)) {
      const cached = accountValidationCache.get(userId)!;
      if (Date.now() - cached.timestamp < cached.expiresIn) {
        console.log(`Using cached account validation for user ${userId}: ${cached.isValid}`);
        return { 
          isValid: cached.isValid, 
          reason: cached.isValid ? 'Cached validation success' : 'Cached validation failed',
          shouldInvalidateSession: !cached.isValid
        };
      }
    }
    
    const keycloakUserInfoUrl = process.env.KEYCLOAK_ISSUER 
      ? `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`
      : "http://localhost:8081/realms/anyclazz/protocol/openid-connect/userinfo";
    
    console.log(`Validating user account for ${userId}...`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(keycloakUserInfoUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    const isValid = response.ok;
    let reason = '';
    
    if (!isValid) {
      reason = `Account validation failed: ${response.status} ${response.statusText}`;
      console.log(reason);
      
      if (response.status === 401 || response.status === 403) {
        accountValidationCache.set(userId, {
          isValid: false,
          timestamp: Date.now(),
          expiresIn: 30 * 1000
        });
        return { isValid: false, reason, shouldInvalidateSession: true };
      }
    } else {
      const userInfo = await response.json();
      reason = 'Account validation successful';
      console.log(`User account validated successfully:`, userInfo.sub || userInfo.preferred_username);
    }
    
    accountValidationCache.set(userId, {
      isValid,
      timestamp: Date.now(),
      expiresIn: isValid ? CACHE_DURATION : 30 * 1000
    });
    
    return { 
      isValid, 
      reason,
      shouldInvalidateSession: !isValid && (response.status === 401 || response.status === 403)
    };
    
  } catch (error) {
    console.error('Error validating user account:', error);
    
    const message = error instanceof Error ? error.message : 'Unknown network error';
    return { 
      isValid: false, 
      reason: `Network error during account validation: ${message}`,
      shouldInvalidateSession: false
    };
  }
}

export function clearAccountValidationCache(userId?: string): void {
  if (userId) {
    accountValidationCache.delete(userId);
  } else {
    accountValidationCache.clear();
  }
}

export function getAccountValidationCacheStats(): { size: number; entries: Array<{ userId: string; isValid: boolean; age: number }> } {
  const now = Date.now();
  return {
    size: accountValidationCache.size,
    entries: Array.from(accountValidationCache.entries()).map(([userId, data]) => ({
      userId,
      isValid: data.isValid,
      age: now - data.timestamp
    }))
  };
}