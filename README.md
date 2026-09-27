# A Family of Buttons

CPSC 581 Group Project 1: a React app with three floating buttons, one per teammate. Each button shows an object for that person's hobbies and flips on hover to show their photo. Buttons carry a "charge": similar people attract and different people repel. Every collision changes the background to show what the pair shares or how they differ. Clicking a button opens a detail page. Includes dark/light mode.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Edit teammate data

Everything lives in [`src/data/people.ts`](src/data/people.ts):

- `hobbies`: the hobby catalog. Each hobby has a label and an icon (`controller`, `music`, `ball`, `camera`, `clapperboard`, `plane`, `vase`, or `hanger`). On the floating buttons, hobbies other than the person's main object show as small badges.
- Each person's `hobbies` list and `object` (the icon shown on their button).
- Each person's `photo`: put an image in `public/photos/` and set `photo: '/photos/name.jpg'`. Without it, the flip side shows an initials placeholder.
- Each person's `gallery`: up to 4 images for the carousel on their page, e.g. `gallery: ['/photos/sanskar-1.jpg', '/photos/sanskar-2.jpg']`. Empty slots show a placeholder.
- Each person's `song`: the track that plays on their page. Audio files aren't included in the repo; drop them into `public/music/` as `sanskar.mp3`, `mimi.mp3`, and `tanishk.mp3` (see `public/music/README.txt`). Until a file is there, the disc is dimmed and tells you which file to add.

On a person page, tap the spinning disc to play or pause, and drag around it in a circle to scrub. Browsers may block autoplay until you interact with the page; the disc shows "Tap to play" when that happens.

Each button carries a + or − charge, shown as particles orbiting it. Opposite charges attract and like charges repel. Starting charges come from `getAffinity` (which compares trait poles and shared hobbies): people similar to Sanskar start with the opposite charge to him. Every collision flips one of the two buttons' charges. If that would leave all three with the same charge (so nobody could ever attract), the third button flips too. Icons are drawn in [`src/components/HobbyIcon.tsx`](src/components/HobbyIcon.tsx).
