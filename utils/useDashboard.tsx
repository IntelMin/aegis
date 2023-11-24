

import { useEffect, useState } from "react";

export function useDashboardData() {
  const [dashboardData, setDashboardData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching new tokens:", error);
      }
    };

    fetchData();
  }, []);

  return dashboardData;
}