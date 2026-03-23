# Contestra 🏆

**Contestra** is a premium, high-performance event management and contest platform designed for both organizers (Hosts) and competitors (Participants). Built with a modern **Ivory & Olive** aesthetic, the platform provides a seamless, elegant experience for creating, discovering, and managing competitive events.

---

## ✨ Features

### 👤 For Participants
- **Event Discovery**: Browse a beautifully curated grid of upcoming contests with advanced search and filtering.
- **Dynamic Registration**: Quick, one-click enrollment for events with real-time capacity tracking.
- **Digital Ticket Wallet**: Access immersive "notched" digital tickets with mock QR codes and event-pass styling.
- **Interactive Profile**: Manage account details (Name, Email) and track registration statistics.

### 🏢 For Hosts
- **Event Orchestration**: Create detailed contest drafts with custom rules, pricing (Paid/Free), categories, and entry limits.
- **Participant Management**: Real-time enrollment lists with a one-click **Export to CSV** feature for administrative handling.
- **Financial Analytics**: Comprehensive dashboard visualizing total revenue, reach, and registration velocity.
- **Workspace Settings**: Fully customizable Organization profile syncing directly to Firestore.

---

## 🛠️ Tech Stack

- **Frontend**: React.js (v18)
- **Build System**: Vite
- **Backend**: Firebase (Authentication & Cloud Firestore)
- **Styling**: Vanilla CSS (Custom Ivory & Olive Design System)
- **Icons**: Lucide React
- **Animations**: CSS Keyframes & SVG Path Drawing

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [npm](https://www.npmjs.com/) 
- A [Firebase Project](https://console.firebase.google.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd contestra
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY="your-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   VITE_FIREBASE_APP_ID="your-app-id"
   VITE_ADMIN_EMAIL="admin@example.com"
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

---

## 📜 Firebase Setup

To enable all features, ensure the following are configured in your Firebase Console:
1. **Authentication**: Enable Email/Password provider.
2. **Firestore Database**: Create a database in "Production Mode" or "Test Mode".
3. **Security Rules**: Deploy the following rules for basic access control:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /events/{eventId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       match /registrations/{regId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

---

## 🎨 Theme Details
- **Background (Ivory)**: `#FDF9DB`
- **Accent (Olive Green)**: `#574C00`
- **Ambient Animation**: Adaptive radial-gradient floating orbs.
- **UI Paradigm**: Elegant Glassmorphism / Ivory Card system.

