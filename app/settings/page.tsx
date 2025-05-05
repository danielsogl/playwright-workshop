'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useSWR, { mutate } from 'swr';
import { Spinner } from '@heroui/spinner';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';

import { title, subtitle } from '@/components/primitives';
import { User } from '@/lib/db/models/user'; // Use the User type without passwordHash

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
  const { status, update: updateSession } = useSession(); // Removed unused 'session'
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
      setName(''); // Clear name if not set or user data is not available
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

      // Update local SWR cache and show success message
      const updatedUserData = await res.json();

      mutate('/api/user', updatedUserData, false); // Update cache without revalidation
      setUpdateSuccess('Profile updated successfully!');

      // Trigger session update with the new name
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
      // Clear password fields after successful change
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
        <Spinner color="primary" label="Loading session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <section
        className="flex flex-col items-center gap-4 py-8 md:py-10 text-center"
        aria-labelledby="access-denied-title"
      >
        <h1 className={title()} id="access-denied-title">
          Access Denied
        </h1>
        <p className={subtitle()}>You must be signed in to view this page.</p>
        <Button
          aria-label="Sign in to view settings"
          as={Link}
          color="primary"
          href="/auth/signin"
        >
          Sign In
        </Button>
      </section>
    );
  }

  // Authenticated view
  return (
    <section
      className="flex flex-col gap-8 py-8 md:py-10 max-w-xl mx-auto"
      aria-labelledby="settings-title"
    >
      <div className="text-center">
        <h1 className={title()} id="settings-title">
          User Settings
        </h1>
        <p className={subtitle()}>Manage your profile information.</p>
      </div>

      {isLoadingUser && (
        <Spinner aria-label="Loading profile data" label="Loading profile..." />
      )}
      {fetchError && (
        <p className="text-danger text-center" role="alert">
          Error loading profile: {fetchError.message}
        </p>
      )}

      {!isLoadingUser && !fetchError && userData && (
        <form
          aria-label="Update profile form"
          className="space-y-6 p-6 border rounded-lg bg-content1"
          onSubmit={handleUpdateProfile}
          name="profile-form"
        >
          {updateSuccess && (
            <p
              className="text-success p-3 bg-success-100 rounded-md"
              role="status"
              aria-live="polite"
            >
              {updateSuccess}
            </p>
          )}
          {updateError && (
            <p
              className="text-danger p-3 bg-danger-100 rounded-md"
              role="alert"
              aria-live="assertive"
            >
              {updateError}
            </p>
          )}

          <Input
            isReadOnly
            aria-label="Your email address (read-only)"
            className="mb-4"
            label="Email"
            value={userData.email}
            id="profile-email"
            name="email"
          />
          <Input
            aria-label="Your name"
            disabled={isUpdating}
            label="Name"
            placeholder="Your name"
            value={name}
            id="profile-name"
            name="name"
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
          >
            {isUpdating ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      )}

      {/* Password Change Form */}
      {!isLoadingUser && !fetchError && userData && (
        <form
          aria-label="Change password form"
          className="space-y-6 p-6 border rounded-lg bg-content1 mt-8"
          onSubmit={handlePasswordChange}
          name="password-form"
        >
          <h2 className="text-lg font-semibold" id="password-change-title">
            Change Password
          </h2>
          {passwordChangeSuccess && (
            <p
              className="text-success p-3 bg-success-100 rounded-md"
              role="status"
              aria-live="polite"
            >
              {passwordChangeSuccess}
            </p>
          )}
          {passwordChangeError && (
            <p
              className="text-danger p-3 bg-danger-100 rounded-md"
              role="alert"
              aria-live="assertive"
            >
              {passwordChangeError}
            </p>
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
          >
            {isChangingPassword ? 'Changing Password...' : 'Change Password'}
          </Button>
        </form>
      )}
    </section>
  );
}
