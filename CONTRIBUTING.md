# Contribution Guidelines

TakeNote is an somthing project, and contributions of any kind are welcome and appreciated. Open issues, bugs, and enhancements are all listed on the [issues](https://github.com/taniarascia/takenote/issues) tab and labeled accordingly. Feel free to open bug tickets and make feature requests. Easy bugs and features will be tagged with the `good first issue` label.

## Issues

If you encounter a bug, please file a bug report. If you have a feature to request, please open a feature request. If you would like to work on an issue or feature, there is no need to request permission. Please add tests to any new features.

## Pull Requests

In order to create a pull request for TakeNote, follow the GitHub instructions for [Creating a pull request from a fork](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork). Please link your pull request to an existing issue.

## Folder Structure

Description of the project files and directories.

```bash
├── config/                    # Configuration
│   ├── cypress.config.js      # Cypress end-to-end test configuration
│   ├── jest.config.js         # Jest unit/component test configuration
│   ├── nodemon.config.json    # Nodemon configuration
│   ├── webpack.common.js      # Webpack shared configuration
│   ├── webpack.dev.js         # Webpack development configuration (dev server)
│   └── webpack.prod.js        # Webpack productuon configuration (dist output)
├── assets/                    # Supplemental assets
├── public/                    # Files that will write to dist on build
├── src/                       # All TakeNote app source files
│   ├── resources/             # Shared resources
│   ├── client/                # React client side code
│   │   ├── api/               # Temporary placeholders for mock API calls
│   │   ├── components/        # React components that are not connected to Redux
│   │   ├── containers/        # React Redux connected containers
│   │   ├── contexts/          # React context global state without Redux
│   │   ├── router/            # React private and public routes
│   │   ├── sagas/             # Redux sagas
│   │   ├── selectors/         # Redux Toolkit selectors
│   │   ├── slices/            # Redux Toolkit slices
│   │   ├── styles/            # Sass style files
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Utility functions
│   │   └── index.tsx          # Client side entry point
│   └── server/                # Node/Express server side code
│       ├── handlers/          # Functions for API endpoints
│       ├── middleware/        # Middleware for API endpoints
│       ├── router/            # Route API endpoints
│       ├── utils/             # Backend utilities
│       └── index.ts           # Server entrypoint
├── tests/                     # Test suites
│   ├── e2e/                   # Cypress end-to-end tests
│   └── unit/                  # React Testing Library and Jest tests
├── .dockerignore              # Files ignored by Docker
├── .editorconfig              # Configures editor rules
├── .gitignore                 # Files ignored by git
├── .prettierrc                # Code convention enforced by Prettier
├── .travis.yml                # Continuous integration and deployment config
├── CHANGELOG.md               # List of significant changes
├── deploy.sh                  # Deployment script for Docker in production
├── Dockerfile                 # Docker build instructions
├── LICENSE                    # License for this open source project
├── package-lock.json          # Package lockfile
├── package.json               # Dependencies and additional information
├── README.md
├── seed.js                    # Seed the app with data for testing
└── tsconfig.json              # Typescript configuration
```

## Scripts

An explanation of the `package.json` scripts.

| Command         | Description                                 |
| --------------- | ------------------------------------------- |
| `dev`           | Run TakeNote in a development environment   |
| `dev:test`      | Run TakeNote in a testing environment       |
| `client`        | Start a webpack dev server for the frontend |
| `server`        | Start a nodemon dev server for the backend  |
| `build`         | Create a production build of TakeNote       |
| `start`         | Start a production server for TakeNote      |
| `test`          | Run unit and component tests                |
| `test:e2e`      | Run end-to-end tests in the command line    |
| `test:e2e:open` | Open end-to-end tests in a browser          |
| `test:coverage` | Get test coverage                           |

## Technologies

This project is possible thanks to all these open source languages, libraries, and frameworks.

| Tech                                          | Description                               |
| --------------------------------------------- | ----------------------------------------- |
| [Codemirror](https://codemirror.net/)         | Browser-based text editor                 |
| [TypeScript](https://www.typescriptlang.org/) | Static type-checking programming language |
| [Node.js](https://nodejs.org/en/)             | JavaScript runtime for the backend        |
| [Express](https://expressjs.com/)             | Server framework                          |
| [React](https://reactjs.org/)                 | Front end user interface                  |
| [Redux](https://redux.js.org/)                | Global state management                   |
| [Webpack](https://webpack.js.org/)            | Asset bundler                             |
| [Sass](https://sass-lang.com/)                | Style preprocessor                        |
| [OAuth](https://oauth.net/)                   | Protocol for secure authorization         |
| [ESLint](https://eslint.org/)                 | TypeScript linting                        |
| [Jest](https://jestjs.io/)                    | Unit testing framework                    |
| [Cypress](https://www.cypress.io/)            | End-to-end testing framework              |

## Styleguide

Coding conventions are enforced by [ESLint](.eslintrc.js) and [Prettier](.prettierrc).

- No semicolons
- Single quotes
- Two space indentation
- Trailing commas in arrays and objects
- [Non-default exports](https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/) are preferred for components
- Module imports are ordered and separated: **built-in** -> **external** -> **internal** -> **css/assets/other**
- TypeScript: strict mode, with no implicitly any
- React: functional style with Hooks (no classes)
- `const` preferred over `let`
