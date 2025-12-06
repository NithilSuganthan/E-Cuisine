# E-Cuisine 🍛

Full-stack food ordering and restaurant management web application.

## Features
- Browse restaurants and menus
- Add items to cart
- User authentication (login/register)
- Admin dashboard for managing menu items
- Responsive design – works on mobile & desktop
- Modern React frontend with real-time updates

## Tech Stack

### Frontend
- React.js (Create React App)
- React Router for navigation
- Axios for API calls
- Tailwind CSS / CSS Modules (update if you use something else)

### Backend (inside `/server`)
- Node.js + Express
- MongoDB / PostgreSQL (update based on what you use)
- JWT authentication
- RESTful API

## Project Structure
E-Cuisine/
├── my-app/               # React frontend (CRA)
│   ├── public/
│   └── src/
├── server/               # Express backend
│   ├── routes/
│   ├── controllers/
│   └── index.js
├── README.md
└── package.json
text## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/NithilSuganthan/E-Cuisine.git
cd E-Cuisine
2. Start the Frontend
Bashcd my-app
npm install
npm start
Frontend runs at → http://localhost:3000
3. Start the Backend (in a new terminal)
Bashcd server
npm install
npm run server
Backend runs at → http://localhost:5000 (or your configured port)
4. Seed sample data (optional)
Bashnpm run seed
Available Scripts (Frontend)
Inside my-app/ folder:

npm start – Runs the app in development mode
npm test – Launches the test runner
npm run build – Builds the app for production

Deployment

Frontend: Vercel / Netlify
Backend: Render / Railway / AWS

Contributing
Pull requests are welcome! For major changes, please open an issue first.
License
MIT

Made with Care by Nithil Suganthan
textJust run this in your project root to apply it instantly:

```bash
curl -o README.md https://raw.githubusercontent.com/NithilSuganthan/E-Cuisine/main/README.md && git add README.md && git commit -m "docs: add professional README" && git push
Or manually create/replace the file and commit.
