import { useParams } from "react-router";
import { Room } from "../components/Room";

export default function RoomPage() {
  const { id } = useParams();

  return (
    <>
      <Room id={id as string} />
    </>
  );
}
