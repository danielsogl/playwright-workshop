'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Divider } from '@heroui/divider';
import { Chip } from '@heroui/chip';
import { User, Plus, Edit, Trash2, Users, Info } from 'lucide-react';

import { title, subtitle } from '@/components/primitives';

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

  const roleColorMap: Record<string, 'danger' | 'warning' | 'default'> = {
    admin: 'danger',
    moderator: 'warning',
    user: 'default',
  };

  return (
    <div className="flex flex-col gap-10 py-8 md:py-10">
      {/* Header */}
      <section className="flex flex-col items-center justify-center gap-4">
        <div className="inline-block max-w-2xl text-center">
          <h1 className={title()} id="fixtures-title">
            User Management Demo
          </h1>
          <p className={subtitle({ class: 'mt-4' })}>
            This demo page is designed for testing Playwright fixtures. Practice
            creating, updating, and deleting users.
          </p>
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* User Form */}
        <Card className="border border-default-200">
          <CardHeader className="flex gap-3 p-6 pb-0">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl ${editingUser ? 'bg-warning/10' : 'bg-primary/10'} flex items-center justify-center`}
              >
                {editingUser ? (
                  <Edit className="w-5 h-5 text-warning" aria-hidden="true" />
                ) : (
                  <Plus className="w-5 h-5 text-primary" aria-hidden="true" />
                )}
              </div>
              <h2 className="text-lg font-semibold">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
            </div>
          </CardHeader>
          <Divider className="mt-4" />
          <CardBody className="p-6">
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
                variant="bordered"
                size="lg"
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
                variant="bordered"
                size="lg"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                isRequired
              />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="role-select" className="text-sm font-medium">
                  Role
                </label>
                <select
                  id="role-select"
                  data-testid="user-role-select"
                  className="px-3 py-2.5 rounded-xl border-2 border-default-200 bg-default-100 text-foreground hover:border-default-400 transition-colors focus:border-primary focus:outline-none"
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
              <div className="flex gap-2 pt-2">
                <Button
                  data-testid="submit-user-button"
                  type="submit"
                  color={editingUser ? 'warning' : 'primary'}
                  isLoading={isLoading}
                  className="flex-1 font-semibold"
                  size="lg"
                >
                  {editingUser ? 'Update User' : 'Add User'}
                </Button>
                {editingUser && (
                  <Button
                    data-testid="cancel-edit-button"
                    type="button"
                    variant="bordered"
                    size="lg"
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
        <Card className="border border-default-200">
          <CardHeader className="flex gap-3 p-6 pb-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-secondary" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold">Users</h2>
              <Chip
                data-testid="user-count"
                variant="flat"
                size="sm"
              >
                {users.length} users
              </Chip>
            </div>
          </CardHeader>
          <Divider className="mt-4" />
          <CardBody className="p-6">
            {users.length === 0 ? (
              <div
                data-testid="empty-state"
                className="text-center text-default-500 py-8"
              >
                <User className="w-12 h-12 mx-auto mb-3 text-default-300" aria-hidden="true" />
                <p>No users found. Add a user to get started.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3" role="list" aria-label="User list">
                {users.map((user) => (
                  <Card
                    key={user.id}
                    className="border border-default-200 hover:border-default-300 transition-colors"
                    data-testid={`user-item-${user.id}`}
                    role="listitem"
                  >
                    <CardBody className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-default-100 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-default-500" aria-hidden="true" />
                          </div>
                          <div className="min-w-0">
                            <h3
                              className="font-semibold"
                              data-testid={`user-name-${user.id}`}
                            >
                              {user.name}
                            </h3>
                            <p
                              className="text-sm text-default-500 truncate"
                              data-testid={`user-email-${user.id}`}
                            >
                              {user.email}
                            </p>
                            <Chip
                              className="mt-1.5"
                              color={roleColorMap[user.role] || 'default'}
                              variant="flat"
                              size="sm"
                              data-testid={`user-role-${user.id}`}
                            >
                              {user.role}
                            </Chip>
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
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <Divider />

      {/* Instructions for Testing */}
      <section className="flex flex-col gap-4">
        <h2 className={title({ size: 'sm', class: 'text-center' })}>
          Testing Instructions
        </h2>
        <Card className="border border-default-200">
          <CardBody className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-default-500">
                This page is specifically designed for Playwright fixture testing. Key scenarios:
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { label: 'User Creation', desc: 'Test adding new users with different roles' },
                { label: 'User Editing', desc: 'Test updating existing user information' },
                { label: 'User Deletion', desc: 'Test removing users from the list' },
                { label: 'State Management', desc: 'Test that the user count updates correctly' },
                { label: 'Form Validation', desc: 'Test required field validation' },
                { label: 'Loading States', desc: 'Test UI during async operations' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3 bg-default-100 rounded-lg"
                >
                  <p className="text-xs text-default-400 mb-1">{item.label}</p>
                  <p className="text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
