import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/notification/get-notifications`,
        { withCredentials: true }
      );
      setUnreadCount(response.data.notifications.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const incrementCount = () => {
    setUnreadCount((prev) => prev + 1);
  };

  const resetCount = () => {
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        incrementCount,
        resetCount,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
