# Blush & Bloom — Nail Technician Booking and Management System

A responsive frontend-only demo built with HTML, CSS and JavaScript.

## Pages
- `index.html` — salon homepage
- `services.html` — service menu and sample prices
- `gallery.html` — nail inspiration gallery
- `booking.html` — appointment request form
- `my-bookings.html` — view/cancel bookings saved on this device
- `dashboard.html` — salon dashboard to confirm, complete or cancel requests and export CSV

## Run the project
1. Extract the ZIP file.
2. Open the `nail_technician_booking_system` folder in VS Code.
3. Open `index.html` with Live Server, or open it directly in a browser.
4. Use the booking page to create a test appointment.
5. View it under **My bookings** and in **dashboard.html**.

## Important limitations
- This is a frontend demonstration only. It does not use PHP, a database, registration or login.
- Bookings are stored in the browser's `localStorage`. They remain on that browser/device and are not shared with another customer's device.
- The dashboard is not protected by authentication. Do not use it to store real customer information in a public deployment.
- Photos and Google Fonts are loaded from the internet, so those visual assets require an internet connection.
- Replace the sample salon name, service prices, technician names, contact details and WhatsApp number with the real salon information.
- The sample WhatsApp link is `https://wa.me/2348000000000` in `booking.html`; replace the number with the salon's WhatsApp number in international format without `+` or spaces.
- Change service names/prices in `services.html` and the service dropdown in `booking.html` to keep them consistent.

## Suggested next upgrade
Connect a backend and database when you need bookings to be shared between customers and salon staff, real slot locking, protected management access, and permanent records.
