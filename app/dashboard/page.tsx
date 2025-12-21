import { getPortfolio } from "@/app/actions";
import DashboardContent from "./DashboardContent";

export default async function DashboardPage() {
  const portfolio = await getPortfolio();

  return <DashboardContent portfolio={portfolio} />;
}
