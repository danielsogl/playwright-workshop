'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useSWR, { mutate } from 'swr';
import { Spinner, Input, Button, Link, Card, CardBody, CardHeader, Divider } from '@heroui/react';
import { Settings, UserCog, Lock, Shield } from 'lucide-react';

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
        <Spinner color="primary" label="Loading session…" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Card className="w-full max-w-md shadow-lg border border-default-200">
          <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-0">
            <div className="w-14 h-14 rounded-2xl bg-danger/10 flex items-center justify-center mb-2">
              <Shield className="w-7 h-7 text-danger" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold" id="access-denied-title">
              Access Denied
            </h1>
            <p className="text-default-500 text-sm">
              You must be signed in to view this page.
            </p>
          </CardHeader>
          <Divider className="mt-4" />
          <CardBody className="px-8 py-6 flex justify-center">
            <Button
              aria-label="Sign in to view settings"
              as={Link}
              color="primary"
              href="/auth/signin"
              size="lg"
              className="font-semibold"
            >
              Sign In
            </Button>
          </CardBody>
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
          <Spinner aria-label="Loading profile data" label="Loading profile…" />
        </div>
      )}
      {fetchError && (
        <p className="text-danger text-center" role="alert">
          Error loading profile: {fetchError.message}
        </p>
      )}

      {/* Profile Form */}
      {!isLoadingUser && !fetchError && userData && (
        <Card className="border border-default-200 shadow-lg">
          <CardHeader className="flex gap-3 p-6 pb-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <UserCog className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold">Profile Information</h2>
            </div>
          </CardHeader>
          <Divider className="mt-4" />
          <CardBody className="p-6">
            <form
              aria-label="Update profile form"
              className="space-y-5"
              onSubmit={handleUpdateProfile}
              name="profile-form"
            >
              {updateSuccess && (
                <div
                  className="p-3 bg-success-50 text-success border border-success-200 rounded-lg text-sm"
                  role="status"
                  aria-live="polite"
                >
                  {updateSuccess}
                </div>
              )}
              {updateError && (
                <div
                  className="p-3 bg-danger-50 text-danger border border-danger-200 rounded-lg text-sm"
                  role="alert"
                  aria-live="assertive"
                >
                  {updateError}
                </div>
              )}

              <Input
                isReadOnly
                aria-label="Your email address (read-only)"
                label="Email"
                value={userData.email}
                id="profile-email"
                name="email"
                variant="bordered"
                size="lg"
              />
              <Input
                aria-label="Your name"
                disabled={isUpdating}
                label="Name"
                placeholder="Your name"
                value={name}
                id="profile-name"
                name="name"
                variant="bordered"
                size="lg"
                onValueChange={setName}
              />
              <Button
                aria-label={
                  isUpdating ? 'Submitting profile update' : 'Submit profile update'
                }
                color="primary"
                disabled={isUpdating}
                isLoading={isUpdating}
                type="submit"
                id="profile-update-button"
                className="w-full font-semibold"
                size="lg"
              >
                {isUpdating ? 'Updating…' : 'Update Profile'}
              </Button>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Password Change Form */}
      {!isLoadingUser && !fetchError && userData && (
        <Card className="border border-default-200 shadow-lg">
          <CardHeader className="flex gap-3 p-6 pb-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-secondary" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold" id="password-change-title">
                Change Password
              </h2>
            </div>
          </CardHeader>
          <Divider className="mt-4" />
          <CardBody className="p-6">
            <form
              aria-label="Change password form"
              className="space-y-5"
              onSubmit={handlePasswordChange}
              name="password-form"
            >
              {passwordChangeSuccess && (
                <div
                  className="p-3 bg-success-50 text-success border border-success-200 rounded-lg text-sm"
                  role="status"
                  aria-live="polite"
                >
                  {passwordChangeSuccess}
                </div>
              )}
              {passwordChangeError && (
                <div
                  className="p-3 bg-danger-50 text-danger border border-danger-200 rounded-lg text-sm"
                  role="alert"
                  aria-live="assertive"
                >
                  {passwordChangeError}
                </div>
              )}

              <Input
                isRequired
                aria-label="Your current password"
                autoComplete="current-password"
                disabled={isChangingPassword}
                label="Current Password"
                placeholder="Enter your current password"
                type="password"
                value={currentPassword}
                id="current-password"
                name="current-password"
                variant="bordered"
                size="lg"
                onValueChange={setCurrentPassword}
              />
              <Input
                isRequired
                aria-label="Your new password"
                autoComplete="new-password"
                disabled={isChangingPassword}
                label="New Password"
                placeholder="Enter your new password"
                type="password"
                value={newPassword}
                id="new-password"
                name="new-password"
                variant="bordered"
                size="lg"
                onValueChange={setNewPassword}
              />
              <Input
                isRequired
                aria-label="Confirm your new password"
                autoComplete="new-password"
                disabled={isChangingPassword}
                errorMessage={
                  newPassword !== confirmPassword && confirmPassword !== ''
                    ? 'Passwords do not match'
                    : undefined
                }
                isInvalid={
                  newPassword !== confirmPassword && confirmPassword !== ''
                }
                label="Confirm New Password"
                placeholder="Confirm your new password"
                type="password"
                value={confirmPassword}
                id="confirm-password"
                name="confirm-password"
                variant="bordered"
                size="lg"
                onValueChange={setConfirmPassword}
              />
              <Button
                aria-label={
                  isChangingPassword
                    ? 'Submitting password change'
                    : 'Submit password change'
                }
                color="secondary"
                disabled={
                  isChangingPassword ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword
                }
                isLoading={isChangingPassword}
                type="submit"
                id="change-password-button"
                className="w-full font-semibold"
                size="lg"
              >
                {isChangingPassword ? 'Changing Password…' : 'Change Password'}
              </Button>
            </form>
          </CardBody>
        </Card>
      )}
    </section>
  );
}
