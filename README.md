Workio Backend
Workio is a website application backend designed to support mental well-being services, including counseling, mood tracking, assessments, and appointment booking. It uses Node.js, Express.js, Sequelize, Supabase, and Twilio to handle user management, appointments, notifications, and more.

🛠️ Technologies Used
Node.js: JavaScript runtime for backend.
Express.js: Web framework for Node.js.
Sequelize: ORM for working with relational databases.
Supabase: Backend-as-a-Service for database storage and authentication.
PostgreSQL: Database system.

🚀 Getting Started
Follow these steps to set up and run the project locally:

1. Clone the Repository
2. Install Dependencies
Install the required Node.js packages: npm install
3. Configure Environment Variables
Create a .env file in the root directory to store sensitive information like database credentials, Twilio API keys, etc.

Example .env file:

PORT=your-local-port-run-server

CLIENT_URL=your-local-url

SUPABASE_URL=your-supabase-url

SUPABASE_KEY=your-supabase-api-key

JWT_SECRET=your-jwt-secret

DEFAULT_PASSWORD=your-default-password-for-user

FASTAPI=your-fast-api

URL_MOMO=your-url-momo

DB_NAME=your-db-name

DB_USER= your-db-username

DB_PASSWORD=o8K4oXtUJrM9Msxh

DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com

DB_PORT=6543


4. Run the Development Server
Now you can start the backend server for development: **npm run dev**
This will start the server and you can begin testing your endpoints locally.

5. Connect to the Host (Optional)
If you wish to deploy this backend on a server or a cloud platform like Heroku, AWS, or Render, you will need to connect your database and API keys to the respective environment.

🔧 Available Scripts
npm run dev: Starts the development server.
npm run migrate: Runs Sequelize migrations to set up/update the database.




