'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useSWR, { mutate } from 'swr';
import {
  Spinner,
  TextField,
  Label,
  Input,
  Button,
  FieldError,
} from '@heroui/react';

import { AccessDenied } from '@/components/access-denied';
import { PageHeader } from '@/components/page-header';
import { User } from '@/lib/db/models/user';
import { fetcher } from '@/lib/utils/fetchers';

// Define the type for user data returned by the API (excluding passwordHash)
type UserData = Omit<User, 'passwordHash'>;

export default function SettingsPage() {
  const { status, update: updateSession } = useSession();
  const isLoadingSession = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  // Fetch user data if authenticated
  const {
    data: userData,
    error: fetchError,
    isLoading: isLoadingUser,
  } = useSWR<UserData>(isAuthenticated ? '/api/user' : null, fetcher);

  const [name, setName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  // State for password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(
    null,
  );
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<
    string | null
  >(null);

  // Update local state when user data is fetched
  useEffect(() => {
    if (userData?.name) {
      setName(userData.name);
    } else {
      setName('');
    }
  }, [userData]);

  const handleUpdateProfile = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const errorData = await res.json();

        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUserData = await res.json();

      mutate('/api/user', updatedUserData, false);
      setUpdateSuccess('Profile updated successfully!');

      await updateSession({ name: updatedUserData.name });
    } catch (err: unknown) {
      setUpdateError(
        err instanceof Error ? err.message : 'An unexpected error occurred.',
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordChangeError('New passwords do not match.');

      return;
    }
    setIsChangingPassword(true);
    setPasswordChangeError(null);
    setPasswordChangeSuccess(null);

    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      setPasswordChangeSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      setPasswordChangeError(
        err instanceof Error ? err.message : 'An unexpected error occurred.',
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoadingSession) {
    return (
      <div
        className="flex justify-center items-center min-h-[calc(100vh-10rem)]"
        role="status"
        aria-label="Loading session"
      >
        <Spinner color="accent" aria-label="Loading session…" />
        <span className="ml-2">Loading session…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AccessDenied linkLabel="Sign in to view settings" />;
  }

  return (
    <section
      className="flex flex-col gap-8 pt-14 pb-24"
      aria-labelledby="settings-title"
    >
      <PageHeader
        id="settings-title"
        label="07 · getByLabel()"
        title="User Settings"
        subtitle="Manage your profile information."
      />

      {isLoadingUser && (
        <div className="flex items-center">
          <Spinner aria-label="Loading profile data" />
          <span className="ml-2">Loading profile…</span>
        </div>
      )}
      {fetchError && (
        <p
          className="rounded-xl bg-danger-soft p-4 text-danger-soft-foreground"
          role="alert"
        >
          Error loading profile: {fetchError.message}
        </p>
      )}

      {!isLoadingUser && !fetchError && userData && (
        <div className="flex flex-wrap items-start gap-6">
          <aside className="flex max-w-full flex-[1_1_280px] flex-col gap-4 rounded-2xl bg-terminal p-6 text-terminal-foreground">
            <span
              aria-hidden="true"
              className="flex size-16 items-center justify-center rounded-full bg-accent font-display text-2xl font-bold text-accent-foreground"
            >
              {(userData.name || userData.email)
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </span>
            <div>
              <p className="text-lg font-semibold">{userData.name}</p>
              <p className="font-mono text-sm break-all text-terminal-muted">
                {userData.email}
              </p>
            </div>
            <span className="self-start rounded-full bg-[#1f3a2a] px-2.5 py-0.5 text-[13px] font-medium text-terminal-accent">
              Signed in
            </span>
          </aside>

          <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-5">
            {/* Profile Form */}
            <section className="overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="border-b border-border px-6 py-5">
                <h2 className="text-[17px] font-semibold">
                  Profile Information
                </h2>
              </div>
              <div className="p-6">
                <form
                  aria-label="Update profile form"
                  className="grid gap-4 sm:grid-cols-2"
                  onSubmit={handleUpdateProfile}
                  name="profile-form"
                >
                  {updateSuccess && (
                    <div
                      className="rounded-xl bg-success-soft p-3 text-sm text-success-soft-foreground sm:col-span-2"
                      role="status"
                      aria-live="polite"
                    >
                      {updateSuccess}
                    </div>
                  )}
                  {updateError && (
                    <div
                      className="rounded-xl bg-danger-soft p-3 text-sm text-danger-soft-foreground sm:col-span-2"
                      role="alert"
                      aria-live="assertive"
                    >
                      {updateError}
                    </div>
                  )}

                  <TextField
                    isReadOnly
                    aria-label="Your email address (read-only)"
                    name="email"
                    value={userData.email}
                  >
                    <Label>Email</Label>
                    <Input id="profile-email" />
                  </TextField>
                  <TextField
                    aria-label="Your name"
                    isDisabled={isUpdating}
                    name="name"
                    value={name}
                    onChange={setName}
                  >
                    <Label>Name</Label>
                    <Input placeholder="Your name" id="profile-name" />
                  </TextField>
                  <Button
                    aria-label={
                      isUpdating
                        ? 'Submitting profile update'
                        : 'Submit profile update'
                    }
                    variant="primary"
                    isDisabled={isUpdating}
                    isPending={isUpdating}
                    type="submit"
                    id="profile-update-button"
                    className="rounded-full font-semibold sm:col-span-2 sm:justify-self-end"
                    size="lg"
                  >
                    {isUpdating ? 'Updating…' : 'Update Profile'}
                  </Button>
                </form>
              </div>
            </section>

            {/* Password Change Form */}
            <section className="overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="border-b border-border px-6 py-5">
                <h2
                  className="text-[17px] font-semibold"
                  id="password-change-title"
                >
                  Change Password
                </h2>
              </div>
              <div className="p-6">
                <form
                  aria-label="Change password form"
                  className="grid gap-4 sm:grid-cols-2"
                  onSubmit={handlePasswordChange}
                  name="password-form"
                >
                  {passwordChangeSuccess && (
                    <div
                      className="rounded-xl bg-success-soft p-3 text-sm text-success-soft-foreground sm:col-span-2"
                      role="status"
                      aria-live="polite"
                    >
                      {passwordChangeSuccess}
                    </div>
                  )}
                  {passwordChangeError && (
                    <div
                      className="rounded-xl bg-danger-soft p-3 text-sm text-danger-soft-foreground sm:col-span-2"
                      role="alert"
                      aria-live="assertive"
                    >
                      {passwordChangeError}
                    </div>
                  )}

                  <TextField
                    className="sm:col-span-2"
                    isRequired
                    aria-label="Your current password"
                    isDisabled={isChangingPassword}
                    type="password"
                    value={currentPassword}
                    name="current-password"
                    onChange={setCurrentPassword}
                  >
                    <Label>Current Password</Label>
                    <Input
                      placeholder="Enter your current password"
                      autoComplete="current-password"
                      id="current-password"
                    />
                  </TextField>
                  <TextField
                    isRequired
                    aria-label="Your new password"
                    isDisabled={isChangingPassword}
                    type="password"
                    value={newPassword}
                    name="new-password"
                    onChange={setNewPassword}
                  >
                    <Label>New Password</Label>
                    <Input
                      placeholder="Enter your new password"
                      autoComplete="new-password"
                      id="new-password"
                    />
                  </TextField>
                  <TextField
                    isRequired
                    aria-label="Confirm your new password"
                    isDisabled={isChangingPassword}
                    isInvalid={
                      newPassword !== confirmPassword && confirmPassword !== ''
                    }
                    type="password"
                    value={confirmPassword}
                    name="confirm-password"
                    onChange={setConfirmPassword}
                  >
                    <Label>Confirm New Password</Label>
                    <Input
                      placeholder="Confirm your new password"
                      autoComplete="new-password"
                      id="confirm-password"
                    />
                    {newPassword !== confirmPassword &&
                      confirmPassword !== '' && (
                        <FieldError>Passwords do not match</FieldError>
                      )}
                  </TextField>
                  <Button
                    aria-label={
                      isChangingPassword
                        ? 'Submitting password change'
                        : 'Submit password change'
                    }
                    variant="primary"
                    isDisabled={
                      isChangingPassword ||
                      !currentPassword ||
                      !newPassword ||
                      !confirmPassword ||
                      newPassword !== confirmPassword
                    }
                    isPending={isChangingPassword}
                    type="submit"
                    id="change-password-button"
                    className="rounded-full font-semibold sm:col-span-2 sm:justify-self-end"
                    size="lg"
                  >
                    {isChangingPassword
                      ? 'Changing Password…'
                      : 'Change Password'}
                  </Button>
                </form>
              </div>
            </section>
          </div>
        </div>
      )}
    </section>
  );
}
