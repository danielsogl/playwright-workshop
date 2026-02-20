'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Divider } from '@heroui/divider';
import { User, Plus, Edit, Trash2 } from 'lucide-react';

import { title } from '@/components/primitives';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function FixturesDemoPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with default users
  useEffect(() => {
    setUsers([
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user',
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (editingUser) {
      // Update existing user
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id ? { ...user, ...formData } : user,
        ),
      );
      setEditingUser(null);
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, newUser]);
    }

    setFormData({ name: '', email: '', role: 'user' });
    setIsLoading(false);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    setUsers((prev) => prev.filter((user) => user.id !== id));
    setIsLoading(false);
  };

  const handleCancel = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'user' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <section className="text-center">
          <h1 className={title()}>User Management Demo</h1>
          <p className="text-default-500 mt-4">
            This demo page is designed for testing Playwright fixtures. Practice
            creating, updating, and deleting users.
          </p>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* User Form */}
          <Card>
            <CardHeader className="flex gap-3">
              <div className="flex items-center gap-2">
                {editingUser ? (
                  <Edit className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Plus className="w-5 h-5" aria-hidden="true" />
                )}
                <h2 className="text-lg font-semibold">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h2>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
                aria-label={editingUser ? 'Edit user form' : 'Add new user form'}
                name="user-form"
              >
                <Input
                  data-testid="user-name-input"
                  label="Name"
                  placeholder="Enter user name"
                  value={formData.name}
                  name="name"
                  autoComplete="name"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  isRequired
                />
                <Input
                  data-testid="user-email-input"
                  type="email"
                  label="Email"
                  placeholder="Enter email address"
                  value={formData.email}
                  name="email"
                  autoComplete="email"
                  spellCheck="false"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  isRequired
                />
                <div className="flex flex-col gap-1">
                  <label htmlFor="role-select" className="text-sm">
                    Role
                  </label>
                  <select
                    id="role-select"
                    data-testid="user-role-select"
                    className="px-3 py-2 rounded-md border border-default-200 bg-default-50 text-foreground"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    data-testid="submit-user-button"
                    type="submit"
                    color="primary"
                    isLoading={isLoading}
                    className="flex-1"
                  >
                    {editingUser ? 'Update User' : 'Add User'}
                  </Button>
                  {editingUser && (
                    <Button
                      data-testid="cancel-edit-button"
                      type="button"
                      variant="bordered"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardBody>
          </Card>

          {/* Users List */}
          <Card>
            <CardHeader className="flex gap-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" aria-hidden="true" />
                <h2 className="text-lg font-semibold">Users</h2>
                <span
                  data-testid="user-count"
                  className="text-sm text-default-500 bg-default-100 px-2 py-1 rounded"
                >
                  {users.length} users
                </span>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              {users.length === 0 ? (
                <div
                  data-testid="empty-state"
                  className="text-center text-default-500 py-8"
                >
                  No users found. Add a user to get started.
                </div>
              ) : (
                <div className="flex flex-col gap-3" role="list" aria-label="User list">
                  {users.map((user) => (
                    <Card
                      key={user.id}
                      className="p-3"
                      data-testid={`user-item-${user.id}`}
                      role="listitem"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-semibold"
                            data-testid={`user-name-${user.id}`}
                          >
                            {user.name}
                          </h3>
                          <p
                            className="text-sm text-default-600 truncate"
                            data-testid={`user-email-${user.id}`}
                          >
                            {user.email}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                user.role === 'admin'
                                  ? 'bg-danger-100 text-danger-800'
                                  : user.role === 'moderator'
                                    ? 'bg-warning-100 text-warning-800'
                                    : 'bg-default-100 text-default-800'
                              }`}
                              data-testid={`user-role-${user.id}`}
                            >
                              {user.role}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="light"
                            isIconOnly
                            aria-label={`Edit user ${user.name}`}
                            data-testid={`edit-user-${user.id}`}
                            onClick={() => handleEdit(user)}
                            isDisabled={isLoading}
                          >
                            <Edit className="w-4 h-4" aria-hidden="true" />
                          </Button>
                          <Button
                            size="sm"
                            variant="light"
                            color="danger"
                            isIconOnly
                            aria-label={`Delete user ${user.name}`}
                            data-testid={`delete-user-${user.id}`}
                            onClick={() => handleDelete(user.id)}
                            isDisabled={isLoading}
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Instructions for Testing */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Testing Instructions</h3>
          </CardHeader>
          <CardBody>
            <div className="prose text-sm">
              <p>
                This page is specifically designed for Playwright fixture
                testing. Key testing scenarios:
              </p>
              <ul>
                <li>
                  <strong>User Creation:</strong> Test adding new users with
                  different roles
                </li>
                <li>
                  <strong>User Editing:</strong> Test updating existing user
                  information
                </li>
                <li>
                  <strong>User Deletion:</strong> Test removing users from the
                  list
                </li>
                <li>
                  <strong>State Management:</strong> Test that the user count
                  updates correctly
                </li>
                <li>
                  <strong>Form Validation:</strong> Test required field
                  validation
                </li>
                <li>
                  <strong>Loading States:</strong> Test UI during async
                  operations
                </li>
              </ul>
              <p>
                Use fixtures to set up initial test data and clean up after
                tests.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
