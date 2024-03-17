import { atom } from "recoil";

//user who is logged in
export const userInfo = atom({
  key: "userInfo",
  default: {
    firstName: "",
    lastName: "",
    email: "",
    id: "",
  },
});


//user with whom you chatting
export const selectedUser = atom({
  key: "selectedUser",
  default: {
    firstName: "",
    lastName: "",
    email: "",
    id: "",
  },
});
