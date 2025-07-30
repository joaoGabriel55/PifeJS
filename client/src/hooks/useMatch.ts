import { useQuery } from "@tanstack/react-query";

async function getMatches(roomId: string) {
  const response = await fetch(`http://localhost:3000/rooms/${roomId}/matches`);;
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  console.log("Matches fetched:", data);
  return data;
}

export function useMatch(roomId: string) {
  const createMatch = () => {
    return {
      id: "hello",
    };
  };

  const matchesQuery = useQuery({ queryKey: ["matches", roomId], queryFn: () => getMatches(roomId) });

  return {
    createMatch,
    matchesQuery,
  };
}
