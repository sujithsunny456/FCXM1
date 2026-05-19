# Tech Stack

## Frontend
- **Framework:** React (with functional components and hooks)
- **Styling:** CSS Modules or plain CSS — no Tailwind or CSS-in-JS unless explicitly added
- **Font:** Open Sans (primary), fallback to sans-serif
- **Icons:** Use a standard icon library (e.g., React Icons or Heroicons)

## Brand CSS Variables
Define these at the `:root` level and use them throughout all stylesheets:

```css
:root {
  /* Primary */
  --color-midnight-blue: #002856;
  --color-dodger-blue: #0598CE;

  /* Secondary */
  --color-yellow: #FFC000;
  --color-orange: #F27D2E;
  --color-blue: #1E4278;
  --color-gray: #555555;

  /* Backgrounds */
  --color-bg-pale-white: #F7F7F7;
  --color-bg-light-blue: #E3EDFD;

  /* Text */
  --color-text-black: #000000;
  --color-text-gray: #747474;
  --color-text-mid-gray: #B3B3B3;

  /* Typography */
  --font-primary: 'Open Sans', sans-serif;
  --font-weight-heading: 700;
  --font-weight-subheading: 600;
  --font-weight-body: 400;
}
```

## Typography Rules
- **Headings:** Bold (700), `var(--color-midnight-blue)`
- **Subheadings:** Semi-Bold (600), `var(--color-blue)`
- **Body Text:** Regular (400), `var(--color-text-black)` or `var(--color-text-gray)`
- **Font import:** Include Open Sans via Google Fonts in the HTML `<head>`

```html
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
```

## Backend (if applicable)
- To be determined based on project requirements (Node.js/Express recommended for consistency with React frontend)

## Common Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```
