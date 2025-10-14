import Container from "@/components/ui/custom/container";

const DashboardPage = () => {
  console.log("window:", typeof window);

  return (
    <section className="flex-1">
      <Container>Dashboard</Container>
    </section>
  );
};

export default DashboardPage;
