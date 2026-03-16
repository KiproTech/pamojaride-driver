import { createContext, useContext, useState, useEffect } from "react";
import { getPassengerProfile, getToken, getImageUrl } from "../services/api";

const PassengerContext = createContext();

export const PassengerProvider = ({ children }) => {
  const [passenger, setPassenger] = useState(null);

  useEffect(() => {
    const loadPassenger = async () => {
      try {
        const token = getToken();
        const role = localStorage.getItem("role");

        // Only load passenger if logged in as passenger
        if (!token || role !== "passenger") {
          console.log("Not logged in as passenger, skipping profile fetch");
          return null;
        }

        // Check if passenger data is stored locally
        const storedPassenger = localStorage.getItem("passenger");
        if (storedPassenger && storedPassenger !== "undefined") {
          setPassenger(JSON.parse(storedPassenger));
          return JSON.parse(storedPassenger);
        }

        // Fetch passenger profile from API
        const data = await getPassengerProfile();
        if (!data) return null;

        // Ensure profile picture has full URL
        if (data.profile_picture) {
          data.profile_picture = getImageUrl(data.profile_picture);
        }

        setPassenger(data);
        localStorage.setItem("passenger", JSON.stringify(data));
        return data;
      } catch (err) {
        console.error("Failed to load passenger profile:", err);
        localStorage.removeItem("passenger"); // clear invalid data
        return null;
      }
    };

    loadPassenger();
  }, []);

  const updatePassenger = (updatedData) => {
    setPassenger((prev) => {
      if (!prev) return null;

      const newPassenger = { ...prev, ...updatedData };

      if (newPassenger.profile_picture) {
        newPassenger.profile_picture = getImageUrl(newPassenger.profile_picture);
      }

      localStorage.setItem("passenger", JSON.stringify(newPassenger));
      return newPassenger;
    });
  };

  return (
    <PassengerContext.Provider value={{ passenger, updatePassenger }}>
      {children}
    </PassengerContext.Provider>
  );
};

export const usePassenger = () => useContext(PassengerContext);