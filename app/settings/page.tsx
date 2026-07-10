'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useSWR, { mutate } from 'swr';
import NextLink from 'next/link';
import { Spinner, TextField, Label, Input, Button, FieldError, Card, Separator } from '@heroui/react';
import { buttonVariants } from '@heroui/styles';
import { UserCog, Lock, Shield } from 'lucide-react';

import { title, subtitle } from '@/components/primitives';
import { User } from '@/lib/db/models/user';

// Define fetcher for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    let errorMessage = 'Failed to fetch user data';

    try {
      const errorData = await res.json();

      errorMessage = errorData.message || errorMessage;
    } catch {
      /* Ignore json parsing error */
    }
    throw new Error(`Fetch error (${res.status}): ${errorMessage}`);
  }

  return res.json();
};

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

  const handleUpdateProfile = async (e: React.FormEvent) => {
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

  const handlePasswordChange = async (e: React.FormEvent) => {
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
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Card className="w-full max-w-md shadow-lg border border-border">
          <Card.Header className="flex flex-col items-center gap-2 pt-8 pb-0">
            <div className="w-14 h-14 rounded-2xl bg-danger/10 flex items-center justify-center mb-2">
              <Shield className="w-7 h-7 text-danger" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold" id="access-denied-title">
              Access Denied
            </h1>
            <p className="text-muted text-sm">
              You must be signed in to view this page.
            </p>
          </Card.Header>
          <Separator className="mt-4" />
          <Card.Content className="px-8 py-6 flex justify-center">
            <NextLink
              aria-label="Sign in to view settings"
              href="/auth/signin"
              className={buttonVariants({ variant: 'primary', size: 'lg' }) + ' font-semibold'}
            >
              Sign In
            </NextLink>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <section
      className="flex flex-col gap-10 py-8 md:py-10 max-w-xl mx-auto"
      aria-labelledby="settings-title"
    >
      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="inline-block max-w-2xl text-center">
          <h1 className={title()} id="settings-title">
            User Settings
          </h1>
          <p className={subtitle({ class: 'mt-4' })}>
            Manage your profile information.
          </p>
        </div>
      </div>

      {isLoadingUser && (
        <div className="flex justify-center">
          <Spinner aria-label="Loading profile data" />
          <span className="ml-2">Loading profile…</span>
        </div>
      )}
      {fetchError && (
        <p className="text-danger text-center" role="alert">
          Error loading profile: {fetchError.message}
        </p>
      )}

      {/* Profile Form */}
      {!isLoadingUser && !fetchError && userData && (
        <Card className="border border-border shadow-lg">
          <Card.Header className="flex gap-3 p-6 pb-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <UserCog className="w-5 h-5 text-accent" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold">Profile Information</h2>
            </div>
          </Card.Header>
          <Separator className="mt-4" />
          <Card.Content className="p-6">
            <form
              aria-label="Update profile form"
              className="space-y-5"
              onSubmit={handleUpdateProfile}
              name="profile-form"
            >
              {updateSuccess && (
                <div
                  className="p-3 bg-success/10 text-success border border-success rounded-lg text-sm"
                  role="status"
                  aria-live="polite"
                >
                  {updateSuccess}
                </div>
              )}
              {updateError && (
                <div
                  className="p-3 bg-danger/10 text-danger border border-danger rounded-lg text-sm"
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
                  isUpdating ? 'Submitting profile update' : 'Submit profile update'
                }
                variant="primary"
                isDisabled={isUpdating}
                isPending={isUpdating}
                type="submit"
                id="profile-update-button"
                className="w-full font-semibold"
                size="lg"
              >
                {isUpdating ? 'Updating…' : 'Update Profile'}
              </Button>
            </form>
          </Card.Content>
        </Card>
      )}

      {/* Password Change Form */}
      {!isLoadingUser && !fetchError && userData && (
        <Card className="border border-border shadow-lg">
          <Card.Header className="flex gap-3 p-6 pb-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-accent" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold" id="password-change-title">
                Change Password
              </h2>
            </div>
          </Card.Header>
          <Separator className="mt-4" />
          <Card.Content className="p-6">
            <form
              aria-label="Change password form"
              className="space-y-5"
              onSubmit={handlePasswordChange}
              name="password-form"
            >
              {passwordChangeSuccess && (
                <div
                  className="p-3 bg-success/10 text-success border border-success rounded-lg text-sm"
                  role="status"
                  aria-live="polite"
                >
                  {passwordChangeSuccess}
                </div>
              )}
              {passwordChangeError && (
                <div
                  className="p-3 bg-danger/10 text-danger border border-danger rounded-lg text-sm"
                  role="alert"
                  aria-live="assertive"
                >
                  {passwordChangeError}
                </div>
              )}

              <TextField
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
                {newPassword !== confirmPassword && confirmPassword !== '' && (
                  <FieldError>Passwords do not match</FieldError>
                )}
              </TextField>
              <Button
                aria-label={
                  isChangingPassword
                    ? 'Submitting password change'
                    : 'Submit password change'
                }
                variant="secondary"
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
                className="w-full font-semibold"
                size="lg"
              >
                {isChangingPassword ? 'Changing Password…' : 'Change Password'}
              </Button>
            </form>
          </Card.Content>
        </Card>
      )}
    </section>
  );
}
