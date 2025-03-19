# Restaurant Menu System

A full-stack web application for restaurant menu management and pre-ordering system. This system allows restaurants to upload weekly menus and customers to view menus and place pre-orders.

## Features

### Restaurant Portal
- Upload and manage menus for current and next week (Monday to Friday)
- View and manage customer orders (acknowledge and complete)
- View customer suggestions

### Customer Portal
- View restaurant menus by day and week
- Place pre-orders with customer details
- Submit suggestions to the restaurant

## Technology Stack

- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Frontend**: Next.js with Tailwind CSS

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) (local installation or MongoDB Atlas)

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd restaurant-menu-system
```

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create .env file (if not already present)
echo "PORT=5000
MONGODB_URI=mongodb://localhost:27017/restaurant-menu-system
NODE_ENV=development" > .env

# Start MongoDB (if using local installation)
# This command may vary depending on your OS and installation method
# For example, on Ubuntu:
sudo service mongod start
# Or create a data directory and start MongoDB:
mkdir -p data/db
mongod --dbpath data/db

# Start the backend server
npm run dev
```

The backend server will run on happy-cafe-happy-team-production.up.railway.app

### 3. Frontend Setup

```bash
# Navigate to the frontend directory from the project root
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend application will run on http://localhost:3000

## API Endpoints

### Menu Endpoints

- `GET /api/menus` - Get all menus
- `GET /api/menus/:day/:week` - Get menu by day and week
- `GET /api/menus/week/:week` - Get all menus for a specific week
- `POST /api/menus` - Create or update a menu
- `DELETE /api/menus/:id` - Delete a menu

### Order Endpoints

- `GET /api/orders` - Get all orders
- `GET /api/orders/status/:status` - Get orders by status
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create a new order
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete an order

### Suggestion Endpoints

- `GET /api/suggestions` - Get all suggestions
- `GET /api/suggestions/:id` - Get suggestion by ID
- `POST /api/suggestions` - Create a new suggestion
- `PATCH /api/suggestions/:id/status` - Update suggestion status
- `DELETE /api/suggestions/:id` - Delete a suggestion

## Usage Guide

### Restaurant Portal

1. Access the restaurant portal at http://localhost:3000/restaurant
2. Use the menu management page to upload menus for different days and weeks
3. Use the order management page to view and manage customer orders
4. Use the suggestions page to view customer feedback

### Customer Portal

1. Access the customer portal at http://localhost:3000/customer
2. View menus for different days and weeks
3. Place orders by selecting items, specifying quantities, and providing contact information
4. Submit suggestions to the restaurant

## Testing

The application includes automated tests for the backend API endpoints:

```bash
# Navigate to the backend directory
cd backend

# Install Jest and Supertest (if not already installed)
npm install --save-dev jest supertest

# Run tests
npx jest
```

## Project Structure

```
restaurant-menu-system/
├── backend/                 # Backend Node.js application
│   ├── config/              # Configuration files
│   ├── controllers/         # Route controllers
│   ├── models/              # Mongoose models
│   ├── routes/              # Express routes
│   ├── tests/               # API tests
│   ├── .env                 # Environment variables
│   ├── package.json         # Backend dependencies
│   └── server.js            # Main server file
│
└── frontend/                # Frontend Next.js application
    ├── src/                 # Source files
    │   ├── app/             # Next.js app directory
    │   │   ├── customer/    # Customer portal pages
    │   │   ├── restaurant/  # Restaurant portal pages
    │   │   ├── layout.js    # Root layout
    │   │   └── page.js      # Home page
    │   ├── components/      # Reusable components
    │   ├── styles/          # CSS styles
    │   └── utils/           # Utility functions
    ├── public/              # Static files
    ├── package.json         # Frontend dependencies
    ├── tailwind.config.js   # Tailwind CSS configuration
    └── postcss.config.js    # PostCSS configuration
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in the `.env` file
   - Verify network connectivity

2. **API Connection Issues**
   - Ensure both backend and frontend servers are running
   - Check for CORS issues in the browser console
   - Verify API endpoint URLs in the frontend code

3. **Frontend Build Errors**
   - Clear the Next.js cache: `rm -rf .next`
   - Reinstall dependencies: `npm install`
   - Check for JavaScript errors in the browser console

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
