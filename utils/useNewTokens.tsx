import { useEffect, useState } from "react";

export function useNewTokens() {
  const [newTokens, setNewTokens] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/new");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setNewTokens(data);
      } catch (error) {
        console.error("Error fetching new tokens:", error);
      }
    };

    fetchData();
  }, []);

  return newTokens;
}
