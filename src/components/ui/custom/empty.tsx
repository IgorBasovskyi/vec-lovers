import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../empty";

interface CustomEmptyProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const CustomEmpty = ({ title, description, icon }: CustomEmptyProps) => (
  <Empty>
    <EmptyMedia variant="icon">{icon}</EmptyMedia>
    <EmptyHeader>
      <EmptyTitle>{title}</EmptyTitle>
      <EmptyDescription>{description}</EmptyDescription>
    </EmptyHeader>
  </Empty>
);

export default CustomEmpty;
