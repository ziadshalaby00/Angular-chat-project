# AngularChatProject (Proton)

---

| #  | Feature                               | Description                                             | Category      |
| -- | ------------------------------------- | ------------------------------------------------------- | ------------- |
| 1  | User Registration                     | Sign up with fullname, username, email, password        | Auth          |
| 2  | User Login                            | Login with username/password using JWT cookies          | Auth          |
| 3  | Google OAuth Sign-In                  | Google Sign-In via popup with code exchange             | Auth          |
| 4  | Token Verification                    | Verify access token with auto-refresh on expiry         | Auth          |
| 5  | Token Refresh Loop                    | Auto-refresh token every ~15 minutes via interval       | Auth          |
| 6  | Logout                                | Clear data, disconnect WebSockets, and redirect         | Auth          |
| 7  | Password Reset                        | Send reset link + confirm new password                  | Auth          |
| 8  | Account Deletion                      | Delete account with password confirmation               | Auth          |
| 9  | CSRF Protection                       | Fetch CSRF token before sensitive requests              | Auth          |
| 10 | Fetch My Profile                      | Get current user data via /me endpoint                  | Profile       |
| 11 | View User Profile                     | Fetch any user's profile by ID                          | Profile       |
| 12 | Update Profile                        | Edit fullname, username, email, bio, image              | Profile       |
| 13 | Remove Profile Image                  | Delete user profile picture                             | Profile       |
| 14 | Chat List                             | Fetch all chats with participants and unread counts     | Chat          |
| 15 | Create Chat                           | Start new chat by username or user ID                   | Chat          |
| 16 | Delete Chat                           | Remove chat and exit if currently open                  | Chat          |
| 17 | Mark as Read                          | Reset unread count for a chat                           | Chat          |
| 18 | Search User                           | Find user by username to add to chat                    | Chat          |
| 19 | Chat List WebSocket                   | Real-time chat updates (new chat, message notification) | Chat          |
| 20 | Fetch Messages                        | Paginated message loading with reverse order            | Messages      |
| 21 | Send Text Message                     | Send text with optional reply\_to reference             | Messages      |
| 22 | Send File                             | Upload file message with preview                        | Messages      |
| 23 | Send Voice Message                    | Record and send audio/voice messages                    | Messages      |
| 24 | Reply to Message                      | Reply to any message type (text/file/audio)             | Messages      |
| 25 | Edit Message                          | Update text message content                             | Messages      |
| 26 | Delete Message                        | Remove a message                                        | Messages      |
| 27 | Real-time Messages WebSocket          | Instant broadcast for new/update/delete messages        | Messages      |
| 28 | Sending Count Indicator               | Show number of messages currently being sent            | Messages      |
| 29 | Voice Recording                       | Start/stop recording with timer display                 | Voice         |
| 30 | Delete Recording                      | Discard recorded blob before sending                    | Voice         |
| 31 | Single Audio Playback                 | Global audio player (only one plays at a time)          | Voice         |
| 32 | Dark/Light Theme                      | Toggle theme with localStorage persistence              | UI/UX         |
| 33 | Quick Theme Toggle                    | Fast theme switcher                                     | UI/UX         |
| 34 | Responsive Breakpoints                | min768px signal for mobile/desktop detection            | UI/UX         |
| 35 | Date Formatting                       | Format dates/times in en-GB locale                      | UI/UX         |
| 36 | Overflow Card Manager                 | Z-index management for dropdowns and menus              | UI/UX         |
| 37 | Message Menu Direction                | Calculate menu direction based on position              | UI/UX         |
| 38 | Auto-scroll to Bottom                 | Scroll to latest message with load-more handling        | UI/UX         |
| 39 | Alert Notifications                   | Success/danger alerts for errors and feedback           | UI/UX         |
| 40 | App Initialization                    | Verify access + CSRF + redirect after reload            | System        |
| 41 | Environment Config                    | Dev/prod URLs for API and WebSocket                     | System        |
| 42 | Lazy Injection Pattern                | Injector pattern to avoid circular dependencies         | System        |
| 43 | **Push Notifications on New Message** | Browser push notification when a new message arrives    | Notifications |
| 44 | **Chat Bump on New Message**          | Move chat to top of list when new message received      | Chat          |

---

