import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";

interface CustomButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const CustomButton = ({ className, children, ...props }: CustomButtonProps) => {
  return (
    <Button className={cn(className, "cursor-pointer")} {...props}>
      {children}
    </Button>
  );
};

export { CustomButton };
