# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

```
Finify-AI-Terminal/
├── backend/
│   ├── main.py                # FastAPI entry, WebSocket logic, & Route definitions
│   ├── agents.py              # Multi-stage AI logic (Strategist + Risk Critic)
│   ├── services.py            # Market Data (yfinance), Backtesting & PDF Export
│   ├── portfolio.py           # RAG Engine, Parser & AI Synthesis Logic
│   ├── database.py            # PostgreSQL Connection & Schema Initialization
│   ├── auth.py                # JWT Authentication & User Security logic
│   ├── stocks.json            # Local Grounding Database (Source of Truth)
│   ├── corpus_cache_inr.pkl   # [Auto-gen] Enriched Metadata Cache
│   ├── embeddings_cache.pkl   # [Auto-gen] Vector Embedding Cache
│   ├── .env                   # Secrets (GEMINI_API_KEY, DATABASE_URL)
│   └── requirements.txt       # Python Dependencies (fastapi, yfinance, pandas, fpdf)
│
└── frontend/
    ├── public/
    │   ├── favicon.ico        # Terminal-style icon
    │   └── index.html         # Root HTML with Google Fonts (Inter/Roboto Mono)
    ├── src/
    │   ├── 📁 api/
    │   │   ├── axiosConfig.js # Global Axios instance with JWT interceptors
    │   │   └── socketConfig.js# WebSocket (Socket.io/Native) pulse initialization
    │   │
    │   ├── 📁 components/     # Reusable UI Nodes
    │   │   ├── Navbar.jsx      # Unified nav with user profile
    │   │   ├── ThemeToggle.jsx 
    │   │   ├── PortfolioForm.jsx 
    │   │   ├── PortfolioDisplay.jsx # Renders Markdown synthesis (Summary/Holdings)
    │   │   └── ProtectedRoute.jsx   # Redirects to Login if no JWT present
    │   │
    │   ├── 📁 context/        # Global State Management
    │   │   ├── AuthContext.js # Manages user session & JWT storage
    │   │   ├── ThemeContext.js 
    │   │   ├── ToastContext.js
    │   │   └── LivePulseContext.js # Manages real-time price state across pages
    │   │
    │   ├── 📁 pages/          # Route-level views
    │   │   ├── LandingPage.jsx# High-conversion "Terminal Entry"
    │   │   ├── LoginPage.jsx  # Auth page with terminal theme
    │   │   ├── RegisterPage.jsx# User onboarding
    │   │   ├── GeneratePage.jsx# The RAG Strategy Engine UI
    │   │   ├── DashboardPage.jsx# Real-time overview of all strategies
    │   │   └── PortfolioPage.jsx# The Strategy Vault (History + PDF Export)
    │   │
    │   ├── 📁 styles/         # Design System
    │   │   ├── theme.js       # Tailwind/CSS Variables (Lavender & Charcoal)
    │   │
    │   ├── App.js             # Router & Context Provider setup
    │   ├── index.js           # React root entry
    │   └── index.css          # Global resets and Tailwind directives
    │
    ├── .env                   # REACT_APP_API_URL (pointing to localhost:8000)
    ├── package.json           # Dependencies: framer-motion, react-markdown, axios
    └── README.md              # Frontend documentation
```