import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ChatRoom from './components/ChatRoom';
import RoomSelection from './components/RoomSelection';
// eslint-disable-next-line no-unused-vars
import Auth from './components/Auth';
import './App.css';

const SOCKET_SERVER = 'http://localhost:5000';

function App() {
  const [socket, setSocket] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Load authentication state from localStorage if available
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [username, setUsername] = useState(() => {
    // Load username from localStorage if available
    return localStorage.getItem('username') || '';
  });

  // Initialize Socket.io connection
  useEffect(() => {
    const newSocket = io(SOCKET_SERVER, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to server');
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Handle joining a room
  const handleJoinRoom = (roomName, user) => {
    if (socket && roomName.trim() && user.trim()) {
      setUsername(user);
      // Save username to localStorage
      localStorage.setItem('username', user);
      setCurrentRoom(roomName);
      
      // Emit joinRoom event to backend
      socket.emit('joinRoom', { room: roomName, username: user });
    }
  };

  // Handle leaving a room
  const handleLeaveRoom = () => {
    if (socket && currentRoom) {
      socket.emit('stopTyping', { room: currentRoom });
    }
    setCurrentRoom(null);
  };

  // Handle changing room from history
  const handleChangeRoom = (newRoom) => {
    if (socket) {
      if (currentRoom) {
        socket.emit('stopTyping', { room: currentRoom });
      }
      setCurrentRoom(newRoom);
      socket.emit('joinRoom', { room: newRoom, username });
    }
  };

  // Handle authentication success
  const handleAuthSuccess = (user) => {
    setUsername(user);
    setIsAuthenticated(true);
    localStorage.setItem('username', user);
    localStorage.setItem('isAuthenticated', 'true');
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentRoom(null);
    setUsername('');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    if (socket) {
      socket.disconnect();
    }
  };

  return (
    <div className="app">
      {!isAuthenticated ? (
        <Auth onAuthSuccess={handleAuthSuccess} />
      ) : !currentRoom ? (
        <RoomSelection onJoinRoom={handleJoinRoom} savedUsername={username} onLogout={handleLogout} />
      ) : (
        <ChatRoom
          socket={socket}
          room={currentRoom}
          username={username}
          onLeaveRoom={handleLeaveRoom}
          onChangeRoom={handleChangeRoom}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
