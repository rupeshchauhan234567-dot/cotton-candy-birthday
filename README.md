# Cotton Candy Birthday World

A responsive React + Vite birthday surprise website with a pastel gradient / glassmorphism look, GSAP entrance animations, Lenis smooth scrolling, interactive chapters, and chapter-by-chapter progress locks.

## Run locally

```bash
npm install
npm run dev
```

Open the localhost URL printed by Vite.

## Personalize before sharing

Edit `src/data.js`:
- `birthdayName` — birthday person's name
- `yourName` — your sign-off
- `birthdayDate` — local date/time in ISO format, e.g. `2026-12-01T00:00:00`
- `birthdayPassword` — the countdown-page password (default: `love123`)
- `letter`, `reasons`, and `memories` — personalize the message and content

Add your music file at `public/music/birthday-song.mp3` (not `src/public`). Add photos as `public/images/memory-1.jpg` through `memory-6.jpg`, or update the paths in `src/data.js`.

## Birthday unlock and chapter progression

The countdown stays visible on its own page. The password is entered on that same page; a correct password does **not** skip the countdown. The next chapter opens only when both conditions are true: the password is correct and the birthday countdown reaches zero. It then opens automatically.

The rest of the journey is gated too. Each chapter has an interaction to complete before the next one unlocks: bloom all flowers, explore every photo, reveal all reasons, open the letter, catch ten hearts, match all memory pairs, complete the four-task quest, make a cake wish, collect eight stars, and open the gift. Progress is saved in browser local storage so completed chapters remain unlocked after refresh.

## Important security note

This is a front-end surprise experience. The password and progress checks are implemented in browser JavaScript/local storage, so they are playful navigation gates rather than secure authentication. A visitor with developer tools can inspect or change them.
