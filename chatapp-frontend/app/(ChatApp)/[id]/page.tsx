import ChatComponent from "@/components/chatDashboard/ChatComponent";
import { selectedUser } from "@/store/atoms/userAtom";
import { useRecoilValue } from "recoil";

export default function page() {
  return <ChatComponent />;
}
