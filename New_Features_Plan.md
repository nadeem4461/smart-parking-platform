# Features Implementation Plan

## 1. Bike Rental Service (Last-Mile Connectivity)
**Concept**: "Park your car, ride a bike to your final destination."
**Flow**:
1.  User books a **4W** parking slot.
2.  On the "Booking Success" screen, show a "Rent a Bike?" card.
3.  User selects a bike type (e.g., "E-Bike", "Scooter") and duration.
4.  System books the bike linked to the parking booking.

### Database Changes
*   New Table: `rental_vehicles`
    *   `id`
    *   `parking_id` (Which parking lot this bike belongs to)
    *   `type` (e.g., 'E-Bike', 'Gear Cycle')
    *   `price_per_hour`
    *   `status` ('available', 'rented', 'maintenance')
*   New Table: `rental_bookings`
    *   `id`
    *   `user_id`
    *   `vehicle_id`
    *   `start_time`, `end_time`
    *   `total_amount`

## 2. Breakdown Assistance (Tow Van)
**Concept**: "Stuck? Get a tow van instantly."
**Flow**:
1.  New "Services" or "Help" tab in the app.
2.  User clicks "Request Tow Van".
3.  User enters **Location** (GPS or manual) and **Issue** (e.g., "Flat Tyre", "Engine Dead").
4.  Frontend shows estimated price (e.g., base fee + per km).
5.  Request is sent to backend.

### Database Changes
*   New Table: `service_requests`
    *   `id`
    *   `user_id`
    *   `type` ('Tow', 'Repair')
    *   `latitude`, `longitude`
    *   `status` ('pending', 'assigned', 'completed')
    *   `estimated_price`

## 3. UI Updates
*   **Booking Success Modal**: Add "Rent Bike" Call-to-Action.
*   **Navbar**: Add "Services" link.
*   **Services Page**: Cards for "Tow Van", "Jumpstart", etc.s
