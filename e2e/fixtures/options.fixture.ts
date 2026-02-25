import { test as base } from '@playwright/test'

export interface Options { user: 'user1' | 'user2' }

export const test = base.extend<Options>({
  user: ['user1', { option: true }],
});