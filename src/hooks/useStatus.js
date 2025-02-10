import BASE_URL from "@/config/BaseUrl";
import { useQuery } from "@tanstack/react-query";

const fetchStatus = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(`${BASE_URL}/api/panel-fetch-status`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch status data");
  return response.json();
};

export const useStatus = () => {
  return useQuery({
    queryKey: ["status"],
    queryFn: fetchStatus,
    staleTime: 1000 * 60 * 3,
  });
};
