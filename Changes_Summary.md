# Summary of Functional Changes (Beyond CSS)

Here is a breakdown of the *logic* and *functionality* I added, separate from the styling changes.

## 1. In-App Navigation (`frontend/src/components/ParkingMap.jsx`)
**What I added:**
*   **Leaflet Routing Machine**: I integrated this library to calculate and draw a real path on the map.
*   **`Routing` Component**: Created a custom sub-component that listens for `userLocation` and `destination` props. When both exist, it automatically requests a route from the OSRM service and renders the blue path line on the map.
*   **Map Updates**: Added `MapUpdater` to automatically pan/zoom the map when you select a parking spot.

## 2. Navigation State Management (`frontend/src/pages/Home.jsx`)
**What I added:**
*   **`destination` State**: Added a new state variable to track where the user wants to go.
*   **`handleNavigate` Function**: When you click "Show Route", this function updates the `destination` state (triggering the map route) and scrolls the view to the map section automatically.

## 3. Dynamic Booking Logic (`frontend/src/components/BookingModal.jsx`)
**What I added:**
*   **Auto-Pre-fill Times**: Added `useEffect` logic to automatically set the "Start Time" to 10 minutes from now and "End Time" to 2 hours from now when the modal opens.
*   **Dynamic Price Calculation**: Added `calculateTotal()` function that updates in real-time. It reads the specific parking spot's prices (2W vs 4W vs EV) and multiplies by the hours selected to show the user the exact cost *before* they book.

## 4. Filter Logic (`frontend/src/components/FilterChips.jsx`)
**What I added:**
*   **Local State Management**: Moved filter state (`vehicle_type`, `priceMin`, `sort`) inside the component so users can toggle multiple filters before clicking "Apply".
*   **Reset Functionality**: Added a `clearFilters` function to wipe all effective filters at once.

## 5. App Structure (`frontend/src/App.jsx`)
**What I added:**
*   **Layout Wrapper**: Wrapped the `Home` component in a flexbox layout to support the new Sidebar + Map split view.
*   **Toaster**: Added the `Toaster` component globally so we can show nice success/error popups from anywhere in the app.
