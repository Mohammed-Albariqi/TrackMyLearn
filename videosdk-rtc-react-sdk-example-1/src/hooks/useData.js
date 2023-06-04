import { useState, useEffect, useCallback } from "react";

export function useData() {
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPeerId, setCurrentPeerId] = useState(null);
  const [focusingPercentage, setFocusingPercentage] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(process.env.REACT_APP_FOCUSING_ENDPOINT, {
        mode: "cors",
      });
      if (response.ok) {
        const data = await response.json();
        setIsLoading(false);
        return data; // Return the fetched data
      } else {
        console.error("Failed to fetch user data from the server.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoading(false);
    }
    return userData; // Return the existing userData in case of an error
  }, [userData]);

  useEffect(() => {
    fetchData();
    return () => {
      // Clean up any resources or subscriptions
    };
  }, [fetchData]);

  useEffect(() => {
    if (focusingPercentage !== null) {
      updateUserData(focusingPercentage);
    }
  }, [focusingPercentage]);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log("[useData] - Fetching user data.");
      const updatedUserData = await fetchData();
      setUserData(updatedUserData);
    };

    const timerId = setInterval(() => {
      fetchUserData();
    }, 4000);

    return () => clearInterval(timerId);
  }, [fetchData]); // Empty dependency array to fetch initial user data and set up interval

  const updateUserData = (newFocusingPercentage) => {
    setUserData((prevData) => {
      const urlParams = new URLSearchParams(window.location.search);
      const uid = urlParams.get("uid");
      const userIndex = prevData.findIndex((user) => user && user.uid === uid);
      if (userIndex !== -1) {
        const updatedData = [...prevData];
        updatedData[userIndex] = {
          ...(updatedData[userIndex] || {}),
          focusingPercentage: newFocusingPercentage,
        };
        return updatedData;
      }
      return prevData;
    });
  };

  const saveUserData = async (user, peerId, newFocusingPercentage) => {
    try {
      const userData = {
        uid: user.uid,
        displayName: user.name,
        type: user.type,
        focusingPercentage: newFocusingPercentage,
        peerId: peerId,
      };
      const response = await fetch(process.env.REACT_APP_FOCUSING_ENDPOINT, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log("Successfully saved user data to the server.");
      } else {
        console.error("Failed to save user data to the server.");
      }
    } catch (error) {
      console.error("Error saving user data:", error);
    }

    setCurrentPeerId(peerId);
    setFocusingPercentage(newFocusingPercentage);
  };

  const getUserData = async (peerId) => {
    try {
      const data = await fetchData();
      const userData = data.find((user) => user.peerId === peerId);
      if (userData) {
        setCurrentPeerId(peerId);
        console.log(`[getUserData] - User Data:`, userData);
        return userData;
      }
      return null;
    } catch (error) {
      console.error("[getUserData] - Error:", error);
      return null;
    }
  };

  return {
    userData,
    saveUserData,
    updateUserData,
    isLoading,
    currentPeerId,
    focusingPercentage,
    getUserData,
    fetchData,
  };
}
