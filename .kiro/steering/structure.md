# Project Structure

## Root Layout
```
FCXM/
├── public/                  # Static assets
│   ├── logo/                # Focal CXM logo files (do not modify)
│   └── favicon.ico
├── src/
│   ├── assets/              # Images, fonts, icons
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Shared elements (Button, Input, Card, Modal)
│   │   └── layout/          # Header, Footer, Sidebar, NavBar
│   ├── pages/               # Top-level route pages
│   │   ├── Home/
│   │   ├── Jobs/            # Job listing & search
│   │   ├── JobDetail/       # Single job view + apply
│   │   ├── Profile/         # Job seeker profile
│   │   ├── Applications/    # Application tracker
│   │   └── Auth/            # Login / Register
│   ├── styles/              # Global styles and CSS variables
│   │   ├── variables.css    # Brand CSS custom properties (colors, fonts)
│   │   ├── global.css       # Reset, base typography, body styles
│   │   └── utilities.css    # Reusable helper classes
│   ├── hooks/               # Custom React hooks
│   ├── context/             # React Context providers (auth, jobs, etc.)
│   ├── services/            # API call functions
│   ├── utils/               # Helper/utility functions
│   ├── App.jsx              # Root component with routing
│   └── main.jsx             # Entry point
├── .kiro/
│   └── steering/            # AI steering rules (product, tech, structure)
├── .gitconfig
├── package.json
└── README.md
```

## Conventions

### Components
- One component per file, named with PascalCase (e.g., `JobCard.jsx`)
- Co-locate component CSS as `ComponentName.module.css` in the same folder
- Keep components small and focused — extract sub-components when a file exceeds ~150 lines

### Pages
- Each page lives in its own folder under `src/pages/`
- Page folder contains the component file and its scoped CSS module

### Styles
- Always use brand CSS variables from `variables.css` — never hardcode color hex values
- Import `variables.css` and `global.css` once in `main.jsx` or `App.jsx`
- Use CSS Modules for component-scoped styles

### Assets
- Logo files live in `public/logo/` — reference them as static URLs, never import and modify
- Use SVG format for icons where possible

### Naming
- Files: PascalCase for components, camelCase for hooks/utils/services
- CSS classes: kebab-case
- Variables/functions: camelCase
