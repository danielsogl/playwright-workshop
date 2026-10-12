'use client';

import { useState, useEffect } from 'react';
import { Button, TextField, Label, Input } from '@heroui/react';
import { ChevronDown, Edit, Trash2, Users as UsersIcon } from 'lucide-react';

import { PageHeader } from '@/components/page-header';

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

  const handleSubmit = async (e: React.SyntheticEvent) => {
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

  const roleClasses: Record<string, string> = {
    admin: 'bg-foreground text-background',
    moderator: 'bg-warning-soft text-warning-soft-foreground',
    user: 'bg-success-soft text-success-soft-foreground',
  };

  return (
    <div className="flex flex-col gap-9 pt-14 pb-24">
      <PageHeader
        id="fixtures-title"
        label="05 · test.extend()"
        title="User Management Demo"
        subtitle="This demo page is designed for testing Playwright fixtures. Practice creating, updating, and deleting users."
      />

      <div className="flex flex-wrap items-start gap-6">
        {/* User Form */}
        <section
          aria-labelledby="user-form-title"
          className="flex max-w-full flex-[1_1_320px] flex-col gap-4 rounded-2xl border border-border bg-surface p-6"
        >
          <h2 className="text-[17px] font-semibold" id="user-form-title">
            {editingUser ? 'Edit User' : 'Add New User'}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            aria-label={editingUser ? 'Edit user form' : 'Add new user form'}
            name="user-form"
          >
            <TextField
              className="flex flex-col gap-1.5"
              name="name"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              isRequired
            >
              <Label>Name</Label>
              <Input
                data-testid="user-name-input"
                placeholder="Enter user name"
                autoComplete="name"
              />
            </TextField>
            <TextField
              className="flex flex-col gap-1.5"
              type="email"
              name="email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              isRequired
            >
              <Label>Email</Label>
              <Input
                data-testid="user-email-input"
                placeholder="Enter email address"
                autoComplete="email"
                spellCheck="false"
              />
            </TextField>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="role-select" className="text-sm font-medium">
                Role
              </label>
              <div className="relative flex items-center">
                <select
                  id="role-select"
                  data-testid="user-role-select"
                  className="min-h-11 w-full cursor-pointer appearance-none rounded-[10px] border border-field-border bg-field pr-10 pl-3 text-foreground focus:outline-2 focus:outline-offset-1 focus:outline-accent"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 size-4"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                data-testid="submit-user-button"
                type="submit"
                variant="primary"
                isPending={isLoading}
                className="flex-1 rounded-full font-semibold"
                size="lg"
              >
                {editingUser ? 'Update User' : 'Add User'}
              </Button>
              {editingUser && (
                <Button
                  data-testid="cancel-edit-button"
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  size="lg"
                  onPress={handleCancel}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </section>

        {/* Users List */}
        <section
          aria-labelledby="users-title"
          className="min-w-0 flex-[999_1_560px] overflow-hidden rounded-2xl border border-border bg-surface"
        >
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <h2 className="text-[17px] font-semibold" id="users-title">
              Users
            </h2>
            <span
              data-testid="user-count"
              className="font-mono text-[13px] text-muted"
            >
              {users.length} users
            </span>
          </div>
          {users.length === 0 ? (
            <div
              data-testid="empty-state"
              className="m-5 flex items-center justify-center gap-2.5 rounded-xl border border-dashed border-field-border p-5 text-muted"
            >
              <UsersIcon className="size-5" aria-hidden="true" />
              <p>No users found. Add a user to get started.</p>
            </div>
          ) : (
            <div className="flex flex-col" role="list" aria-label="User list">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-separator px-6 py-3 last:border-b-0 sm:grid sm:grid-cols-[12rem_minmax(0,1fr)_auto_auto]"
                  data-testid={`user-item-${user.id}`}
                  role="listitem"
                >
                  <h3
                    className="flex-1 font-semibold"
                    data-testid={`user-name-${user.id}`}
                  >
                    {user.name}
                  </h3>
                  <p
                    className="w-full min-w-0 truncate font-mono text-sm text-muted sm:w-auto"
                    data-testid={`user-email-${user.id}`}
                  >
                    {user.email}
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[13px] font-medium ${roleClasses[user.role] ?? 'bg-default text-foreground'}`}
                    data-testid={`user-role-${user.id}`}
                  >
                    {user.role}
                  </span>
                  <div className="flex">
                    <Button
                      variant="ghost"
                      isIconOnly
                      className="size-11 rounded-[10px]"
                      aria-label={`Edit user ${user.name}`}
                      data-testid={`edit-user-${user.id}`}
                      onPress={() => handleEdit(user)}
                      isDisabled={isLoading}
                    >
                      <Edit className="size-[18px]" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      isIconOnly
                      className="size-11 rounded-[10px] text-danger"
                      aria-label={`Delete user ${user.name}`}
                      data-testid={`delete-user-${user.id}`}
                      onPress={() => handleDelete(user.id)}
                      isDisabled={isLoading}
                    >
                      <Trash2 className="size-[18px]" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Instructions for Testing */}
      <section
        aria-labelledby="testing-instructions-title"
        className="flex flex-col gap-5 rounded-[20px] bg-terminal p-8 text-terminal-foreground"
      >
        <div className="flex flex-wrap justify-between gap-2">
          <h2
            className="font-display text-[28px] font-bold tracking-[-0.01em]"
            id="testing-instructions-title"
          >
            Testing Instructions
          </h2>
          <p className="text-terminal-muted">
            This page is specifically designed for Playwright fixture testing.
            Key scenarios:
          </p>
        </div>
        <dl className="m-0 grid gap-px overflow-hidden rounded-xl border border-terminal-border bg-terminal-border md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              label: 'User Creation',
              desc: 'Test adding new users with different roles',
            },
            {
              label: 'User Editing',
              desc: 'Test updating existing user information',
            },
            {
              label: 'User Deletion',
              desc: 'Test removing users from the list',
            },
            {
              label: 'State Management',
              desc: 'Test that the user count updates correctly',
            },
            {
              label: 'Form Validation',
              desc: 'Test required field validation',
            },
            {
              label: 'Loading States',
              desc: 'Test UI during async operations',
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-1.5 bg-terminal px-[18px] py-4"
            >
              <dt className="text-[13px] text-terminal-muted">{item.label}</dt>
              <dd className="text-sm">{item.desc}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
