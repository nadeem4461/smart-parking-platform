# Implementation Plan: Payments & New Features

## Phase 1: Payment Integration (Razorpay) 💳
**Goal**: Replace the current "Pay on Spot" placeholder with real Razorpay payments.
**Flow**:
1.  User clicks "Book Slot".
2.  Backend creates a Razorpay Order.
3.  Frontend opens Razorpay Checkout.
4.  On success, Backend verifies signature and confirms the booking.

### Changes
*   **Database**: Alter `bookings` table.
    *   Add `payment_id` (VARCHAR)
    *   Add `order_id` (VARCHAR)
    *   Add `payment_status` (VARCHAR, default 'pending')
*   **Backend**:
    *   Install `razorpay`.
    *   New `routes/paymentRoutes.js`.
    *   `POST /create-order`: Generate order ID.
    *   `POST /verify`: Verify signature and set booking status to 'confirmed'.
*   **Frontend**:
    *   Update `BookingModal.jsx` to handle Razorpay flow.

## Phase 2: Bike Rental Service 🚲
**Goal**: Allow users to rent bikes (2W) after booking a parking spot.
*   **Database**: `rental_vehicles` & `rental_bookings`.
*   **Flow**: "Rent a Bike" popup after successful parking payment.

## Phase 3: Breakdown Assistance (Tow Van) 🚚
**Goal**: Allow users to request a tow van.
*   **Database**: `service_requests`.
*   **Flow**: Request help -> Pay via Razorpay (reusing Phase 1 logic) -> Technician assigned.

## User Review Required
> [!IMPORTANT]
> **Razorpay Keys**: You will need to provide `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in the `.env` file. I will use dummy keys for now or you can add them.
