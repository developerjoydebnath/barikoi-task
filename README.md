# Barikoi Map Finder

A modern, responsive web application for searching locations, viewing them on an interactive map, and getting directions, built with Next.js, Redux Toolkit, and Barikoi Maps.

## 1. What trade-offs did you consciously make due to time constraints?

When building this application within a limited timeframe, I made a few practical choices to prioritize core functionality:

- **Simple UI over complex design systems:** I used Tailwind CSS to quickly put together a clean, functional interface. I focused on building an intuitive layout rather than spending time on a heavy, custom design system or advanced micro-animations.
- **Basic API optimization:** I added debouncing to the search inputs to ensure we don't spam the API on every keystroke. However, I skipped more advanced optimizations like request cancellation, strict rate limiting, or fine-grained cache control.
- **Essential error handling only:** I focused on handling the most common errors (such as failed search requests or denied location permissions) by showing simple fallback messages. A production app would need a more robust system with user-friendly retry states and error tracking.

## 2. If this app needed to scale (more data, more features), what would you refactor first?

If this application needed to scale to handle thousands of users or significantly more complex data, here is what I would prioritize refactoring:

- **Implement Rate Limiting and Cache Management:** Implement rate limiting and cache management to reduce redundant requests and improve performance. It will help to handle the large dataset and more features.
- **Map Performance Optimization:** Handling large datasets on a map can be heavy. To prevent the map from slowing down, I would implement marker clustering, lazy load map data based on the visible bounding box, and heavily optimize to prevent unnecessary map component re-renders.
- **Further Component Modularization:** I would continue to break down the large components into smaller, focused pieces. I would continue this pattern across the entire application to keep components small, highly reusable, and easier to test.
- **Advanced Caching:** While RTK Query handles basic caching well, I would fine-tune the cache invalidation strategies to reduce redundant network requests even further, making the application feel instantaneous as users navigate back and forth.
- **Refine State Management Structure:** I already following modular pattern to manage the state, which makes it easier to maintain and scale. In future I will continue to follow this pattern and refine more to make the code more modular and maintainable and scalable.

## 3. Current Features

- **Interactive Mapping:** Fully interactive map interface utilizing Barikoi Maps.
- **Smart Location Search:** Fast, debounced autocomplete search to quickly find locations.
- **Multiple Marker Visualization:** Search results can be plotted as multiple markers on the map for a wider spatial view.
- **Direction & Routing:** A dedicated direction mode to find the optimal route between a start point and destination, including distance and duration estimates.
- **Current Location Integration:** Native browser geolocation support to quickly use your current GPS location as a start or end point for directions.
- **Reverse Geocoding:** Automatically resolves coordinate data into readable street addresses when selecting points on the map or typing coordinates in search bar. It can also resolve coordinates using the browser's geolocation API.
- **Responsive Layout:** A clean, mobile-first design built with Tailwind CSS that works seamlessly across desktop and mobile devices.
- **State Management:** Robust application state handling utilizing Redux Toolkit for predictable UI behavior.