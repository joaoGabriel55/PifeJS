import { useQuery } from "@tanstack/react-query";

function getRoom() {
  return {
    id: 1,
    name: "Room 1",
  };
}

export function useRoom(id: string) {
  const {
    data: room,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["room", id], queryFn: () => getRoom() });

  return {
    room,
    isError,
    isLoading,
  };
}
