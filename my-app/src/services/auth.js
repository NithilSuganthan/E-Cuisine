// Mock user data for development with roles
const MOCK_USERS = [
  {
    id: 1,
    email: 'user@example.com',
    password: 'password123', // In a real app, this would be hashed
    name: 'Demo User',
    role: 'user'
  },
  {
    id: 2,
    email: 'admin@example.com',
    password: 'adminpass',
    name: 'Site Admin',
    role: 'admin'
  }
];

/**
 * Authenticate a user by email/password and optional role.
 * If role is provided, the matched user's role must match.
 */
export const loginUser = async (email, password, role = null) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = MOCK_USERS.find(u => 
    u.email === email && u.password === password
  );
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (role && user.role !== role) {
    throw new Error('User does not have the required role');
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const logoutUser = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 250));
  localStorage.removeItem('user');
};