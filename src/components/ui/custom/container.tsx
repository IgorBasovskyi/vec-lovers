import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  classes?: string;
}

const Container = ({ children, classes }: ContainerProps) => {
  return <div className={`container mx-auto px-4 ${classes}`}>{children}</div>;
};

export default Container;
