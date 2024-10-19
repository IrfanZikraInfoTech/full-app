// utils/GlobalContext.jsx
import React, { createContext, useContext, useState } from "react";

export const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children, ssrProps }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (type, text) => {
    const id = Math.random(); // generate a unique id for the alert
    setAlerts((alerts) => [...alerts, { id, type, text }]);
    setTimeout(() => {
      setAlerts((alerts) => alerts.filter((alert) => alert.id !== id));
    }, 3000);
  };


  return (
    <GlobalContext.Provider
      value={{
        ...ssrProps,
        alerts,
        showAlert,
        setAlerts,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useAlert = () => {
  const { showAlert } = useContext(GlobalContext);
  return showAlert;
};