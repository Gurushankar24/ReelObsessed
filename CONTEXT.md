# ReelObsessed Project Context

## Project Overview
This is an Angular application named "movie-search" that allows users to search for movies, view details, and manage personal movie lists.

## Tech Stack
- **Framework:** Angular (^21.1.0)
- **UI Components:** Angular Material (~21.2.0)
- **Reactive Programming:** RxJS (~7.8.0)
- **Language:** TypeScript (~5.9.2)
- **Build Tool:** Angular CLI (^21.1.0)
- **Testing:** Vitest (^4.0.8), JSDOM (^27.1.0)
- **Styling:** SCSS

## Folder Structure
The project follows a standard Angular CLI structure:
- **`src/`**: Contains the main application source code.
  - **`app/`**: The core of the Angular application.
    - **`components/`**: Reusable UI components.
      - `header/`: The main navigation header.
      - `liked/`: Displays a list of liked movies.
      - `movie-details/`: Shows detailed information for a single movie.
      - `search-page/`: The primary search interface for finding movies.
      - `spinner/`: A loading indicator.
      - `toast-container/`: Displays toast notifications.
      - `wishlist/`: Displays the user's movie wishlist.
    - **`services/`**: Injectable services for handling business logic.
      - `movie-service.ts`: Fetches movie data.
      - `toast.service.ts`: Manages application notifications.
    - **`app.routes.ts`**: Defines the application's routing configuration.
    - **`app.config.ts`**: Main application configuration.
  - **`public/`**: Stores static assets like `favicon.ico`.
  - **`index.html`**: The main HTML entry point.
  - **`main.ts`**: The main bootstrap file for the application.
  - **`styles.scss`**: Global styles.
- **`dist/`**: The build output directory.
- **`angular.json`**: Angular CLI configuration.
- **`package.json`**: Project dependencies and scripts.
- **`tsconfig.json`**: TypeScript compiler configuration.

## What's Built
The application is a feature-rich movie search tool. Key functionalities include:
- A search page to find movies.
- A detailed view for each movie.
- Personal collection management for "liked" movies and a "wishlist".
- UI feedback through spinners and toast notifications.
- A clear, component-based architecture with separated services for data handling.
