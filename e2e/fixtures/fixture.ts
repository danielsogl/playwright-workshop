import { mergeTests } from '@playwright/test';
import { test as base } from './base.fixture';
import { test as loginTest } from './login-page.fixture';

export const test = mergeTests(base, loginTest);
export const expect = test.expect;
