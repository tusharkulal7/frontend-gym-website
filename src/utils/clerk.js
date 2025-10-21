export async function setUserRole(userId, role) {
  try {
    // This function should be called from a component where Clerk is available
    // The token will be passed as a parameter
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${arguments[2]}` // token passed as third argument
      },
      body: JSON.stringify({ userId, role })
    });

    if (!response.ok) throw new Error('Failed to update role');
    return await response.json();
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
}

export function isAdmin(user) {
  return user?.publicMetadata?.role === 'admin' || user?.publicMetadata?.role === 'super-admin';
}

export function isSuperAdmin(user) {
  return user?.publicMetadata?.role === 'super-admin';
}
