import logger from './logger';

export async function promoteUserToAdmin(userId, clerkToken) {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/promote/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${clerkToken}`
      }
    });

    if (!response.ok) throw new Error('Failed to promote user');
    return await response.json();
  } catch (error) {
    logger.error('Error promoting user:', error);
    throw error;
  }
}

export async function demoteUser(userId, token) {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/demote/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to demote user');
    return await response.json();
  } catch (error) {
    logger.error('Error demoting user:', error);
    throw error;
  }
}

export async function deleteUser(userId, token) {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/delete/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to delete user');
    return await response.json();
  } catch (error) {
    logger.error('Error deleting user:', error);
    throw error;
  }
}

export function isAdmin(user) {
  return user?.publicMetadata?.role === 'admin' || user?.publicMetadata?.role === 'super-admin';
}

export function isSuperAdmin(user) {
  return user?.publicMetadata?.role === 'super-admin';
}
