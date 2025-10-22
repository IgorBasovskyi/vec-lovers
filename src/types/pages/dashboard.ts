export interface DashboardPageProps {
  searchParams?: Promise<{
    search?: string;
    category?: string;
    liked?: string;
    offset?: string;
  }>;
}
