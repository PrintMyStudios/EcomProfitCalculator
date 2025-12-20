// This file should be deleted - the homepage is at app/(marketing)/page.tsx
// Route groups don't affect URLs, so (marketing)/page.tsx serves /
// Having both creates a conflict where this file takes priority
// TODO: Delete this file and keep only app/(marketing)/page.tsx

export { default } from './(marketing)/page';
export { metadata } from './(marketing)/page';
