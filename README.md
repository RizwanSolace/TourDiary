# Tourism Diary - Full Stack Application

A modern full-stack tourism diary application built with React, Express, and static JSON data. Document your travel adventures, manage destinations, and preserve your travel memories.

## 📋 Project Structure

```
tourism-diary/
├── backend/
│   ├── server.js              # Express server with API routes
│   ├── package.json           # Backend dependencies
│   └── data/
│       └── diary.json         # Static JSON database with entries & destinations
└── frontend/
    ├── src/
    │   ├── App.jsx            # Main React component
    │   ├── App.css            # Application styling
    │   ├── main.jsx           # React entry point
    │   └── components/
    │       ├── DestinationList.jsx      # List of all destinations
    │       ├── DestinationDetail.jsx    # Individual destination view
    │       ├── EntryForm.jsx            # Create new diary entries
    │       └── AllEntries.jsx           # View and manage all entries
    ├── index.html             # HTML entry point
    ├── package.json           # Frontend dependencies
    └── vite.config.js         # Vite configuration
```

## ✨ Features

### Frontend (React)
- **Destination Gallery**: Browse beautiful tourist destinations with images
- **Diary Entries**: Create, read, update, and delete travel diary entries
- **Filtering & Sorting**: Filter entries by destination, sort by date or rating
- **Timeline View**: Visual timeline of all your travel memories
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Rich UI**: Modern, intuitive interface with smooth animations

### Backend (Express)
- **RESTful API**: Complete CRUD operations for entries and destinations
- **Static JSON Data**: File-based database with JSON storage
- **CORS Support**: Enable cross-origin requests for frontend
- **Error Handling**: Comprehensive error management and validation
- **API Endpoints**:
  - `GET /api/entries` - Get all diary entries
  - `GET /api/entries/:id` - Get single entry
  - `POST /api/entries` - Create new entry
  - `PUT /api/entries/:id` - Update entry
  - `DELETE /api/entries/:id` - Delete entry
  - `GET /api/destinations` - Get all destinations
  - `POST /api/destinations` - Create new destination
  - `GET /api/destinations/:destId/entries` - Get entries for destination

### Data (JSON)
- Pre-populated with 6 world-famous destinations
- 7 sample diary entries showcasing features
- Easily extensible format for adding more data

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd tourism-diary-backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The API will be running at `http://localhost:5000`

**For development with auto-reload:**
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd tourism-diary-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## 📱 Application Guide

### Destinations View
- View all tourist destinations in a grid layout
- Click on any destination card to see detailed information
- View all diary entries for that destination

### Diary Entries
- **All Entries**: See all your diary entries in a timeline view
- **Filter**: Filter by specific destinations
- **Sort**: Sort by newest/oldest, highest/lowest rating, or alphabetically
- **Edit**: Modify existing entries (title, content, rating)
- **Delete**: Remove entries from your diary

### Create Entry
- Select a destination from the dropdown
- Add entry date
- Rate your experience (1-5 stars)
- Write your travel story
- Entry is saved to JSON and appears immediately

### Destination Detail
- View destination image and information
- See coordinates (latitude/longitude)
- View all entries from that destination
- Quick access to manage individual entries

## 🎨 Customization

### Adding More Destinations

Edit `backend/data/diary.json`:

```json
{
  "id": "7",
  "name": "Destination Name",
  "country": "Country",
  "description": "Description of the destination",
  "coordinates": {
    "lat": 40.1234,
    "lng": -74.5678
  },
  "image": "https://image-url.com/image.jpg"
}
```

### Styling

Customize the look by editing `frontend/src/App.css`. Key color variables:
- Primary gradient: `#667eea` to `#764ba2`
- Header: `#2c3e50` to `#3498db`
- Accent: `#3498db`
- Text: `#2c3e50` (dark), `#7f8c8d` (muted)

## 📦 API Response Examples

### Get All Entries
```bash
GET http://localhost:5000/api/entries
```

Response:
```json
[
  {
    "id": "101",
    "title": "First glimpse of the Eiffel Tower",
    "content": "Walking through the streets of Paris...",
    "destinationId": "1",
    "date": "2024-06-15",
    "rating": 5,
    "photos": [],
    "createdAt": "2024-06-15T10:30:00Z"
  }
]
```

### Create Entry
```bash
POST http://localhost:5000/api/entries
Content-Type: application/json

{
  "title": "My Amazing Trip",
  "content": "This was incredible...",
  "destinationId": "1",
  "date": "2024-09-15",
  "rating": 5
}
```

## 🔧 Deployment

### Backend (Node.js Hosting)
Options: Heroku, Railway, Render, DigitalOcean, AWS

1. Set up environment
2. Install dependencies: `npm install`
3. Start: `npm start`
4. Set `PORT` environment variable if needed

### Frontend (Static Hosting)
Options: Vercel, Netlify, GitHub Pages, AWS S3

1. Build: `npm run build`
2. Deploy `dist/` folder
3. Update API URL in `src/App.jsx` to match backend URL

## 🐛 Troubleshooting

**CORS Error**: Ensure backend is running on port 5000 before starting frontend

**API Connection Failed**: 
- Check backend is running: `http://localhost:5000/health`
- Verify API_BASE URL in App.jsx matches backend URL

**Data Not Persisting**: Ensure `backend/data/` directory exists and is writable

**Port Already in Use**:
- Backend: Change PORT in server.js
- Frontend: Change port in vite.config.js

## 📚 Technology Stack

**Frontend:**
- React 18
- Vite (build tool)
- CSS3 with responsive design
- Fetch API for HTTP requests

**Backend:**
- Node.js
- Express.js
- File System API
- CORS middleware

**Data:**
- JSON (static file storage)
- UTF-8 encoding

## 🎯 Future Enhancements

- [ ] User authentication and profiles
- [ ] Photo uploads and galleries
- [ ] Map integration for destinations
- [ ] Search functionality
- [ ] Tags and categories
- [ ] Social sharing features
- [ ] Export entries to PDF
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Database migration (MongoDB/PostgreSQL)

## 📄 License

This project is open source and available for educational and personal use.

## 🤝 Contributing

Feel free to fork, modify, and extend this application for your own tourism diary needs!

---

**Happy travels and happy writing! ✈️📝**
