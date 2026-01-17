# Event Ticket Booking System
- ## Description
A backend system for event ticket booking designed to handle concurrent seat reservations, ensure data consistency, and manage the booking lifecycle reliably under race conditions.
- ## setup locally

# Clone the repository
git clone <repo-url>

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start the server
npx tsc -b
node dist/index.js
