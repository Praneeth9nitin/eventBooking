# Event Ticket Booking System
- ## Description
A backend system for event ticket booking designed to handle concurrent seat reservations, ensure data consistency, and manage the booking lifecycle reliably under race conditions.
- ## setup locally

### Clone the repository
git clone <https://github.com/Praneeth9nitin/eventBooking.git>

### Install dependencies
npm install

### Setup environment variables
create .env file provide 
DATABASE_URL and JWT_SECRECT

### Run database migrations
npx prisma migrate dev

### Start the server
npx tsc -b
node dist/index.js
