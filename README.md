# Barikoi Map Finder

A modern, responsive web application for searching locations, viewing them on an interactive map, and getting directions, built with Next.js, Redux Toolkit (RTK Query), and Barikoi Maps.

---

## 1. What trade-offs did you consciously make due to time constraints?

When building this application within a limited timeframe, I prioritized delivering a stable and functional core experience over advanced optimizations.

- **Simple UI over complex design systems:**  
  I used Tailwind CSS to quickly build a clean and responsive interface, focusing on usability rather than advanced design systems or animations.

- **Basic API optimization with RTK Query:**  
  API calls are handled using Redux Toolkit Query, which provides built-in caching and state management. However, I did not implement advanced features such as request cancellation, polling, or fine-grained cache invalidation.

- **Debounced search without full request control:**  
  Debouncing is applied to prevent excessive API calls, but more advanced optimizations like aborting stale requests or rate limiting were not implemented.

- **Essential error handling only:**  
  I handled common edge cases (e.g., failed API calls, denied location permissions) using simple fallback messages. A production-ready system would include retry mechanisms and more user-friendly error states.

---

## 2. If this app needed to scale (more data, more features), what would you refactor first?

To scale this application for larger datasets and increased usage, I would prioritize the following improvements:

- **API layer and caching strategy refinement:**  
  Enhance RTK Query configuration with better cache invalidation, request deduplication, and potentially introduce a service layer for better separation of concerns.

- **Map performance optimization:**  
  Implement marker clustering, viewport-based data loading (bounding box queries), and memoization to prevent unnecessary re-renders.

- **Component architecture improvement:**  
  Further modularize components to improve reusability, maintainability, and testability.

- **State management scaling:**  
  Continue refining the modular Redux structure and normalize state for better scalability.

- **Testing and reliability:**  
  Add unit and integration tests to ensure stability as features grow.

---

## 3. Current Features

- **Interactive Mapping:** Fully interactive map interface utilizing Barikoi Maps.
- **Smart Location Search:** Fast, debounced search to quickly find locations.
- **Multiple Marker Visualization:** Displays multiple search results as markers on the map.
- **Direction & Routing:** Find optimal routes between two points with distance and duration.
- **Current Location Integration:** Uses browser geolocation to select the user’s current position.
- **Reverse Geocoding:** Converts coordinates into readable addresses.
- **Responsive Layout:** Mobile-first UI built with Tailwind CSS.
- **State Management:** Managed using Redux Toolkit with RTK Query.
- **Secure API Handling:** API keys are managed via environment variables and proxied through Next.JS api routes.

---

## 4. Project Structure

- `app`: Contains the main application files, including the root layout, home page, and API routes.
- `modules`: Contains feature-based modules for the application. Each module contains its own state management, components, types, services, and etc.
- `shared`: Contains the shared components, configs, lib, utils, types, services, store, features, hooks, constants, and etc.

---

## 5. Setup Instructions

Follow these steps to run the project locally:

### 1. Clone the repository

Using HTTPS:
```bash
git clone https://github.com/developerjoydebnath/barikoi-task.git
```

Using SSH:
```bash
git clone git@github.com:developerjoydebnath/barikoi-task.git
```

### 2. Navigate to the project directory
```bash
cd barikoi-task
```

### 3. Install dependencies

```bash
npm install 
```

> Note: if you face any peer dependency issues, use `npm install --legacy-peer-deps`

### 4. Setup environment variables

Copy the example environment file and fill in the required values:

```bash
cp .env.example .env
```

> Note: if you don't have `.env.example` file, create it manually with the following content:
```bash
BARIKOI_API_KEY=your_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_PREFIX=/api
NEXT_PUBLIC_APP_NAME="Barikoi Map"
NEXT_PUBLIC_APP_DESCRIPTION="Map Integration with Barikoi API"
```

Edit the `.env` file with your API keys and other configuration values.

### 5. Run the development server

```bash
npm run dev
```
The application will be available at http://localhost:3000