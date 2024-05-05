import LandingPage from "@/components/chatDashboard/LandingPage";
import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Home() {
  const data = await getServerSession(authOptions);

  return <LandingPage data={data?.user} />;
}
