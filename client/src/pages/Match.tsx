import { useParams } from "react-router";
import { Match } from "../components/match/Match";
import { getSocket } from "../lib/websocket";

export default function MatchPage() {
  const { matchId } = useParams();

  const socket = getSocket({ matchId: matchId as string });

  return <Match socket={socket} />;
}
