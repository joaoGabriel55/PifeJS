import { useQuery } from "@tanstack/react-query";

async function getRoom(id: string) {
  const response = await fetch(`http://localhost:3000/rooms/${id}`);;
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  console.log("Room fetched:", data);
  return data;
}

export function useRoom(id: string) {
  const {
    data: room,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["room", id], queryFn: () => getRoom(id) });

  return {
    room,
    isError,
    isLoading,
  };
}
