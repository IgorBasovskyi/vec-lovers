"use server";

import AddIconDialog from "@/components/Dashboard/AddIconDialog";
import DashboardContent from "@/components/Dashboard/DashboardContent";
import Filters from "@/components/Filters";
import SearchBar from "@/components/Search";
import Container from "@/components/ui/custom/container";
import { Separator } from "@/components/ui/separator";
import { dashboardOptions } from "./options";
import { DashboardPageProps } from "@/types/pages/dashboard";

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const { response, filters, resolvedSearchParams, params } =
    await dashboardOptions({ searchParams });

  return (
    <section className="flex-1">
      <Container classes="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-8">
          <h2>Dashboard</h2>
          <SearchBar initialSearch={resolvedSearchParams?.search} />
        </div>

        <Filters filters={filters} />

        <Separator />

        <div className="flex justify-end">
          <AddIconDialog />
        </div>

        <DashboardContent initialData={response} initialParams={params} />
      </Container>
    </section>
  );
};

export default DashboardPage;
