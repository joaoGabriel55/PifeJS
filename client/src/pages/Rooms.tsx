import { useEffect, useState } from "react";

const useRooms = () => {
  const [rooms, setRooms] = useState<Array<any>>([]);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await fetch("http://localhost:3000/rooms");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Rooms fetched:", data);

        setRooms(data);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    }

    fetchRooms();
  },[]);

  return { rooms }
}

export default function RoomsPage() {
  const { rooms } = useRooms();

  return (
    <>
      <h1>Rooms</h1>

      {rooms.map((room) => (
        <a key={room.id} href={`/rooms/${room.id}`}>
          <h3>Room ID: {room.id}</h3>
        </a>
      ))}
    </>
  );
}
