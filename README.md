FetchQuest (Frontend)

FetchQuest is a hyper-local, peer-to-peer web application designed to create a collaborative micro-economy within a closed community like a college campus. The platform connects students who need items ("Requesters") with other students willing to purchase and deliver those items for a small fee ("Runners").

This repository contains the React frontend for the application, built with Vite.

Technology Stack

Framework: React (Vite)

Routing: react-router-dom

Real-time: socket.io-client

Styling: CSS3 (with Light/Dark mode)

State Management: React Context API (for global auth state)

Key Features

Full User Authentication: Secure login, registration, and email verification flow.

Persistent Session: Global AuthContext ensures the user stays logged in even after a page refresh.

Password Reset: Secure "Forgot Password" flow via email.

Dashboard: A central hub for users to manage their quests:

"My Quests": A list of quests created by the user.

"My Runs": A list of quests accepted by the user.

Live Requests Feed: A public page showing all open quests that can be accepted.

Real-time Chat: A private, room-based chat page for the Requester and Runner of an accepted quest.

Profile Management: Users can update their name, profile picture, and add a secure phone number.

Reputation System:

Users can rate each other after a quest is completed.

Average ratings are displayed on the "Live Requests" feed to build trust.

Full Quest Workflow:

Create a quest (via a pop-up modal).

Delete an open quest.

Accept a quest (as a Runner).

Cancel an accepted quest (by either user).

Mark a quest as completed (by the Requester).

Trust & Safety:

Phone numbers are encrypted on the backend.

A "Show Contact Info" button securely reveals the other user's phone number only during an active, accepted quest.

A banner reminds users to add their phone number for safety.
