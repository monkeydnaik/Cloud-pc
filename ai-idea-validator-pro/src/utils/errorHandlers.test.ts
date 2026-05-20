import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleFirestoreError, OperationType } from './errorHandlers';
import { auth } from '../firebase-init';

vi.mock('../firebase-init', () => ({
  auth: {
    currentUser: null
  }
}));

describe('handleFirestoreError', () => {
  beforeEach(() => {
    // Reset mock before each test
    vi.clearAllMocks();
    auth.currentUser = null;
  });

  it('should throw formatted error with no user info when currentUser is null', () => {
    const testError = new Error('Permission denied');

    try {
      handleFirestoreError(testError, OperationType.GET, 'users/123');
      expect.fail('Should have thrown an error');
    } catch (e: any) {
      const parsed = JSON.parse(e.message);
      expect(parsed.error).toBe('Permission denied');
      expect(parsed.operationType).toBe(OperationType.GET);
      expect(parsed.path).toBe('users/123');
      expect(parsed.authInfo.userId).toBeUndefined();
    }
  });

  it('should include user info when currentUser is present', () => {
    (auth as any).currentUser = {
      uid: 'user-123',
      email: 'test@example.com',
      emailVerified: true,
      isAnonymous: false,
      tenantId: 'tenant-456',
      providerData: [
        {
          providerId: 'google.com',
          displayName: 'Test User',
          email: 'test@example.com',
          photoURL: 'https://example.com/photo.png'
        }
      ]
    };

    try {
      handleFirestoreError('Network error', OperationType.WRITE, 'posts/456');
      expect.fail('Should have thrown an error');
    } catch (e: any) {
      const parsed = JSON.parse(e.message);
      expect(parsed.error).toBe('Network error');
      expect(parsed.operationType).toBe(OperationType.WRITE);
      expect(parsed.path).toBe('posts/456');

      expect(parsed.authInfo.userId).toBe('user-123');
      expect(parsed.authInfo.email).toBe('test@example.com');
      expect(parsed.authInfo.emailVerified).toBe(true);
      expect(parsed.authInfo.isAnonymous).toBe(false);
      expect(parsed.authInfo.tenantId).toBe('tenant-456');
      expect(parsed.authInfo.providerInfo).toHaveLength(1);
      expect(parsed.authInfo.providerInfo[0].providerId).toBe('google.com');
      expect(parsed.authInfo.providerInfo[0].displayName).toBe('Test User');
      expect(parsed.authInfo.providerInfo[0].email).toBe('test@example.com');
      expect(parsed.authInfo.providerInfo[0].photoUrl).toBe('https://example.com/photo.png');
    }
  });

  it('should suppress console.error during the test', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      handleFirestoreError('test', OperationType.LIST, null);
    } catch (e) {
      // Expected
    }

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
