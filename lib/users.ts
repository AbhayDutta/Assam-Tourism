import fs from 'fs';
import path from 'path';

interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  name: string;
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Load users from file
function loadUsers(): User[] {
  ensureDataDir();
  
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
  
  // Return default users if file doesn't exist or has errors
  return [
    {
      id: 'admin-1',
      email: 'abhaydutta123456@gmail.com',
      password: 'Hutao098',
      role: 'admin',
      name: 'Admin User'
    }
  ];
}

// Save users to file
function saveUsers(users: User[]) {
  ensureDataDir();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

// Get users (load from file)
export function getUsers(): User[] {
  return loadUsers();
}

export function addUser(user: User) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

export function findUserByEmail(email: string) {
  const users = getUsers();
  return users.find(u => u.email === email);
}

export function findUserById(id: string) {
  const users = getUsers();
  return users.find(u => u.id === id);
}
