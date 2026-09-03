# 📱 Proton — Real-Time Chat & Video Calling

A modern, secure, and fully-featured real-time communication platform built with **Angular 20**. Proton goes beyond standard messaging with a **fully integrated WebRTC video/audio calling system**, real-time WebSocket messaging, rich media sharing, and a polished responsive UI.

---

## ✨ Key Features

### 📹 Real-Time Video & Audio Calling (WebRTC)
Proton features a complete, production-ready WebRTC implementation for seamless peer-to-peer communication:

- **Peer-to-Peer Connection** — Establishes direct `RTCPeerConnection` for low-latency, high-quality audio/video transmission.
- **WebSocket Signaling** — Exchanges SDP offers/answers and ICE candidates securely via the WebSocket channel (`ChatsService`).
- **Caller & Callee Flows**:
  - **Caller**: Initiates a call from the chat header → navigates to `/calling-page` → creates and sends an SDP offer.
  - **Callee**: Receives a real-time `call.offer` signal → sees a floating incoming call card with the caller's avatar → accepts or rejects the call.
- **Media Controls** — Toggle **microphone** and **camera** on/off during an active call with instant visual feedback.
- **Incoming Call UI** — A beautiful, non-intrusive floating card (`app-call`) that displays the caller's name, avatar, and "Accept/Reject" buttons, ensuring you never miss a call.
- **Call Termination** — Gracefully ends calls from either side with proper cleanup of media tracks and peer connections, preventing resource leaks.

### 🔐 Authentication & Security
- **JWT Authentication** — Secure access/refresh tokens stored in HTTP‑only cookies.
- **Google OAuth 2.0** — One‑click sign‑in with Google Identity Services.
- **Email Verification** — Verify your email address upon signup.
- **Password Reset** — Request a reset link via email.
- **CSRF Protection** — Built‑in CSRF token handling for all state‑changing requests.
- **Account Deletion** — Permanent account removal with a two-step confirmation process.

### 💬 Real‑Time Messaging
- **Instant Delivery** — WebSocket connection for real‑time message propagation.
- **Message Types** — Send and receive **text**, **files** (images, videos, PDFs, documents), and **voice messages**.
- **Reply to Messages** — Reply to any message type (text, file, voice).
- **Edit & Delete** — Edit or delete your own messages (removed from both sides).
- **Message Highlighting** — Auto‑scroll and highlight replied‑to messages.
- **Unread Badges** — Real-time unread count per chat.

### 📎 Rich Media Support
- **File Uploads** — Upload images, videos, documents, PDFs, and archives.
- **File Preview** — In‑line preview for images, videos, and audio.
- **Image Zoom** — Click to zoom any shared image in full screen.
- **Voice Recording** — Record and send voice messages with built‑in recorder and waveform visualization.

### 👥 Chat & Profile Management
- **Chat List** — View all conversations with unread indicators and search functionality.
- **Create New Chat** — Start a chat by searching for any registered username.
- **Remove Chat** — Remove conversations from your list (other participant unaffected).
- **User Profiles** — View any profile, update account info, upload/change profile picture.
- **Change Password & Email** — Secure password update and email change with verification.

### 🎨 User Experience
- **Dark / Light Theme** — Full theme toggle with system preference detection.
- **Responsive Design** — Mobile‑first sidebar layout built with Tailwind CSS.
- **PWA Ready** — Service worker enabled for offline capabilities and app‑like experience.
- **Real‑time Notifications** — Toast alerts for all actions and errors.

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Angular 20 (Standalone Components, Signals, Zoneless Change Detection) |
| **Real-Time Comm.** | Native WebSocket API, **WebRTC (RTCPeerConnection, MediaDevices)** |
| **Styling** | Tailwind CSS v4, Custom Dark/Light Theme, FontAwesome |
| **UI Components** | `@ziadshalaby/ngx-zs-component` (Modal, Alert, Sidebar, Navbar, etc.) |
| **State Management** | Angular Signals (`signal`, `computed`, `effect`) |
| **HTTP Client** | Angular HttpClient (with CSRF & credentials) |
| **Authentication** | JWT Access/Refresh Tokens, Google Identity Services |
| **Build Tool** | Angular CLI v20, PostCSS, TypeScript 6.0 |
| **Testing** | Vitest, Jasmine, Karma |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20.x or later
- **Angular CLI** 20.x
- A running **Django REST backend** with WebSocket support (configured in `proxy.conf.json`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ziadshalaby00/Angular-chat-project.git
   cd Angular-chat-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run the development server**
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200`

5. **Build for production**
   ```bash
   ng build
   ```
   The build artifacts will be stored in the `dist/` directory.

---

## 🧩 How WebRTC Calling Works in Proton

1. **Initiating a Call**  
   The user clicks the phone icon in the chat header. The app navigates to `/calling-page` with query parameters (`toUserId`, `chatId`, `role=caller`). The `WebrtcService` creates an SDP offer and sends it via the WebSocket signaling channel.

2. **Receiving a Call**  
   The callee's WebSocket receives a `call.offer` signal. The `ChatsService` updates the `incomingCall` signal, triggering the floating call card (`app-call`) to appear with the caller's avatar and name.

3. **Accepting a Call**  
   The callee clicks "Accept". The app navigates to `/calling-page` (`role=callee`), sets the remote description, creates an SDP answer, and sends it back. The peer-to-peer connection is established.

4. **During the Call**  
   Both users see their local video (muted) and the remote video. They can toggle their microphone or camera on/off in real-time using the floating control buttons.

5. **Ending a Call**  
   Either user clicks the red hang-up button. A `call.end` signal is sent via WebSocket. Both peers close the `RTCPeerConnection`, stop all media tracks, and navigate back to the chats view, ensuring complete resource cleanup.

---

## 📦 Core Dependencies
```json
{
  "@angular/common": "^22.1.4",
  "@angular/core": "^22.1.4",
  "@angular/forms": "^22.1.4",
  "@angular/router": "^22.1.4",
  "@angular/service-worker": "^22.1.4",
  "@ziadshalaby/ngx-zs-component": "^4.6.3",
  "tailwindcss": "^4.1.17",
  "rxjs": "~7.8.0"
}
```

---

## 📜 License

Developed entirely by **Ziad Shalaby** ([@ziadshalaby00](https://github.com/ziadshalaby00)).

This project is licensed under the **ISC License**.

---

**Made with ❤️ by Ziad Shalaby**
