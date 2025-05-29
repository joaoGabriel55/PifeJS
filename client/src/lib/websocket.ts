import { io, Socket } from "socket.io-client";

class Websocket {
  private socket: Socket;

  constructor() {
    this.socket = io("http://localhost:3000", { autoConnect: false });
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

export const socket = new Websocket();
