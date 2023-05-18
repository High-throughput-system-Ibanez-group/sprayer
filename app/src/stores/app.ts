import { makeAutoObservable, runInAction } from "mobx";
import createSingleton from "~/stores/utils/createSingleton";
import { io, type Socket } from "socket.io-client";

class AppStore {
  socket: Socket | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
    void this.startSocket();
  }

  startSocket = async () => {
    await fetch("/api/socket");
    runInAction(() => {
      this.socket = io();
      this.socket.on("connect", () => {
        console.log("connected");
      });
    });
  };
}

export const appStore = createSingleton(AppStore);
