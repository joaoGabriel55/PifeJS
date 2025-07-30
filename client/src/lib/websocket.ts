import { io, Socket } from "socket.io-client";

class Websocket {
  private socket: Socket;

  constructor(query: Record<string, string> = {}) {
    this.socket = io("http://localhost:3000", { autoConnect: false, query, auth: { token: localStorage.getItem("token") || "" } });
  }

  connect() {
    this.socket.connect();
  }

  emit<T = unknown>({ key, value }: { key: string; value: T }) {
    this.socket.emit(key, value);
  }

  disconnect() {
    this.socket.disconnect();
  }

  on<T = unknown>(key: string, callback: (...args: T[]) => void) {
    this.socket.on(key, callback);
  }

  off(key: string) {
    this.socket.off(key);
  }
}

export const getSocket = (query?: Record<string, string>) => {
  return new Websocket(query);
}
