"use client";
import { urls } from "@/lib/constants";
import { userInfo } from "@/store/atoms/userAtom";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRecoilValue } from "recoil";
import { Socket, io } from "socket.io-client";

interface ISocketContext {
  socket: Socket | undefined;
}

const SocketContext = createContext<ISocketContext | null>(null);

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState<Socket | undefined>();
  const user = useRecoilValue(userInfo);

  useEffect(() => {
    if (user) {
      const _socket = io(urls.backendUrl);
      setSocket(_socket);

      return () => {
        if (_socket) {
          _socket.disconnect();
          setSocket(undefined);
        }
      };
    }
  }, [user]);

  useEffect(() => {
    if (socket && user) {
      socket.emit("add-user", user.id);
    }
  }, [socket, user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const state = useContext(SocketContext);

  if (!state) {
    throw new Error("state is undefined");
  }

  return state;
};
