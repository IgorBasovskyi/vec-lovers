import AddIconDialog from "@/components/Dashboard/AddIconDialog";
import Container from "@/components/ui/custom/container";

const DashboardPage = async () => {
  return (
    <section className="flex-1">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2>Dashboard</h2>
          <AddIconDialog />
        </div>
      </Container>
    </section>
  );
};

export default DashboardPage;
