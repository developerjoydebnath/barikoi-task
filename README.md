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

- **Backend/API proxy layer:**  
  Move API calls to Next.js API routes to securely manage API keys, enforce rate limiting, and centralize business logic.

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
- **Secure API Handling:** API keys are managed via environment variables and proxied through backend routes.

---

## 4. Project Structure

- `app`: Core Next.js app (routes, layouts, API routes)
- `modules`: Feature-based modules (state, components, services)
- `shared`: Reusable utilities, components, hooks, and configurations