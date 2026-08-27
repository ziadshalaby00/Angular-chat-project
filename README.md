# Proton 💬

A real-time, secure chat application built with **Angular** and **Django REST**.  
Proton delivers a WhatsApp-like messaging experience with text, file sharing, voice messages, and live WebSocket updates — all wrapped in a modern, responsive UI with full dark/light theme support.

---

## ✨ Key Features

- **Authentication** — JWT cookie-based auth, Google OAuth, password reset, account deletion
- **Real-Time Messaging** — WebSocket-powered instant delivery, edits, deletions, and read receipts
- **Rich Media** — Text, image/video/file uploads, and voice message recording with waveform playback
- **Chat Management** — Create chats by username, delete conversations, unread badges, search
- **Reply & Edit** — Reply to any message type; edit or delete your own messages
- **User Profiles** — View any profile, update account info, upload/change profile picture
- **PWA Ready** — Service worker, web manifest, offline-capable architecture
- **Responsive UI** — Mobile-first sidebar layout, Tailwind CSS, custom scrollbar, fluid animations

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Angular 20 (Standalone Components, Signals, Zoneless Change Detection) |
| **Styling** | Tailwind CSS v4, Custom Dark/Light Theme, FontAwesome |
| **UI Kit** | `@ziadshalaby/ngx-zs-component` |
| **State** | Angular Signals (`signal`, `computed`, `effect`) |
| **HTTP** | Angular HttpClient (with CSRF & Credentials) |
| **Real-Time** | Native WebSocket API |
| **Auth** | JWT Access/Refresh Tokens, Google Identity Services |
| **Build** | Angular CLI v20, PostCSS, TypeScript 5.9 |

---

## 📄 License

Developed entirely by [Ziad Shalaby](https://github.com/ziadshalaby00).

This project is licensed under the **MIT License**.

---

