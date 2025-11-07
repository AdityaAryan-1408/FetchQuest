# ⚡ FetchQuest (Frontend)

**FetchQuest** is a hyper-local, peer-to-peer web application designed to foster a **collaborative micro-economy** within closed communities like college campuses 🎓.  

It connects students who need items (**Requesters**) with others willing to purchase and deliver them for a small fee (**Runners**).  

This repository contains the **React frontend** for the application, built with **Vite**.

---

## 🧩 Technology Stack

- ⚛️ **Framework:** React (Vite)
- 🧭 **Routing:** react-router-dom
- 🔁 **Real-time:** socket.io-client
- 🎨 **Styling:** CSS3 (with Light/Dark mode)
- 🧠 **State Management:** React Context API (Global Auth State)

---

## 🚀 Key Features

### 🔐 Full User Authentication
- Secure **Login**, **Registration**, and **Email Verification** flow.  
- Persistent sessions using a global **AuthContext** to keep users logged in after refresh.

### 🔑 Password Reset
- "Forgot Password" flow with secure **email-based recovery**.

---

### 🏠 Dashboard
A central hub for users to manage their activity:
- **My Quests:** List of quests created by the user.  
- **My Runs:** List of quests accepted by the user.  
- **Live Requests Feed:** Real-time list of open quests available to accept.

---

### 💬 Real-time Chat
- Private, **room-based chat** between Requester and Runner after quest acceptance.  
- Built with **socket.io-client** for instant messaging.

---

### 👤 Profile Management
- Update **name**, **profile picture**, and **secure phone number**.  
- A banner reminds users to add their contact info for safety.

---

### ⭐ Reputation System
- Users can **rate each other** after completing a quest.  
- Average ratings appear on the **Live Requests Feed** to build trust within the community.

---

### ⚙️ Full Quest Workflow
- ➕ Create a quest (via modal popup)
- ❌ Delete an open quest
- 🤝 Accept a quest (as a Runner)
- 🔄 Cancel an accepted quest (by either user)
- ✅ Mark a quest as completed (by the Requester)

---

### 🛡️ Trust & Safety
- 🔒 Phone numbers are **encrypted** on the backend.  
- ☎️ “Show Contact Info” button reveals the other user’s phone number **only** during an active quest.  
- 🧠 Reminder banner ensures users stay verified and contactable.

---

## 🧰 Developer Info

**Frontend:** React (Vite)  
**State:** React Context API  
**Realtime:** socket.io-client  
**Styling:** CSS3 (Dark/Light theme)  

---

## 🧑‍💻 Future Enhancements
- 📱 Progressive Web App (PWA) support  
- 🔔 Push notifications for quest updates  
- 🌍 Integration with Google Maps for delivery tracking  

---

### 🌟 Contributing
Pull requests are welcome! Please open an issue first to discuss what you’d like to change.

---

### 📝 License
This project is licensed under the **MIT License** – see the [LICENSE](./LICENSE) file for details.

---

💡 *Built with care for student communities and powered by collaboration.*
