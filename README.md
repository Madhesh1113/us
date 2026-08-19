# Us

A private, two-person space to share feelings through emoji and short
messages, built for the design we worked through together.

## Current state — front end only

This version has **no backend and no real authentication**. It uses the
browser's `localStorage` to fake shared syncing between two accounts, so
you can log in as either person and see the same feed. This is meant for
you and your wife to try out and give feedback on before we wire in
Firebase for real cross-device sync.

**Temporary test accounts** (shown as quick-login buttons on the login
screen, or type them manually):

- Username `Madhesh`, password `1234`
- Username `Amogaa`, password `1234`

Because both accounts share the same browser's `localStorage`, switching
between them (via the quick-login buttons) simulates two devices talking
to each other. Opening the app in two different browsers or two different
computers will **not** sync, since there's no real backend yet — that's
the next step once the design is finalized.

## Running it locally

```bash
npm install
npm run dev
```

Then open the printed `localhost` link in your browser.

## Deploying to GitHub Pages

1. Push this project to a GitHub repository.
2. In `vite.config.js`, set `base: '/your-repo-name/'` to match your
   actual repository name exactly (case-sensitive).
3. Build the project:
   ```bash
   npm run build
   ```
4. Deploy the `dist` folder to GitHub Pages. The simplest way:
   ```bash
   npm install --save-dev gh-pages
   npx gh-pages -d dist
   ```
   Then enable GitHub Pages in your repo settings, pointing to the
   `gh-pages` branch.
5. Your app will be live at `https://<your-username>.github.io/<repo-name>/`.

## What's simulated vs. real

| Feature | Status |
|---|---|
| Login | Fake — two hardcoded accounts, no real security |
| Emoji feed, threads, replies | Fully working |
| Seen status (red/green) | Fully working, syncs via localStorage |
| Mutual resolve + happy emoji picker | Fully working |
| Shatter/burst closing animation | Fully working |
| Dark mode toggle | Fully working |
| Real-time sync across separate devices | Not yet — needs Firebase |
| Push notifications | Not yet — needs Firebase Cloud Messaging |
| Real photos as avatars | Not yet — placeholder initials |

## Next step

Once you and your wife are happy with how it looks and feels, the next
step is wiring in Firebase (Realtime Database + Authentication +
Hosting), all on the free tier, for real two-device syncing, notifications,
and secure login.
