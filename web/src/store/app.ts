import { makeAutoObservable } from "mobx";
import createSingleton from "~/store/utils/createSingleton";
import { io, type Socket } from "socket.io-client";

class AppStore {
  socket: Socket | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
    void this.startSocket();
  }

  startSocket = async () => {
    await fetch("/api/socket");
    this.socket = io();

    this.socket.on("connect", () => {
      console.log("connected");
    });
  };
}

export const appStore = createSingleton(AppStore);
