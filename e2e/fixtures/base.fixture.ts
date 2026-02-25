import { mergeTests } from "@playwright/test";
import { test as userTest } from "./user.fixture";
import { test as authTest } from "./auth.fixture";
import { test as pagesTest } from "./pages.fixture";
import { test as optionsTest } from "./options.fixture";

export const test = mergeTests(userTest, authTest, pagesTest, optionsTest);