import { urls } from "@/lib/constants";
import axios from "axios";
import { atom, selector } from "recoil";
import { selectedUser, userInfo } from "./userAtom";

//all messages are fetched from the backend and then stored in the atom
//only when senders and recievers id is available else empty array will be returned.

export const messagesAtom = atom<any>({
  key: "messagesAtom",
  default: selector({
    key: "messagesSelector",
    get: async ({ get }) => {
      if (get(selectedUser).id) {
        const { data } = await axios.get(
          `${urls.backendUrl}/api/v1/chat/getMessages/${get(userInfo).id}/${
            get(selectedUser).id
          }`
        );
        return data.messages;
      }
      return [];
    },
  }),
});

export const typingAtom = atom({
  key: "typingAtom",
  default: {
    from: "",
    to: "",
    status: false,
  },
});

export const messageAtom = atom({
  key: "message",
  default: "",
});

export const lastMessage = atom({
  key: "lastMessage",
  default: selector({
    key: "lastMessageSelector",
    get: ({ get }) => {
      const messages = get(messagesAtom);
      return messages?.at(-1);
    },
  }),
});
