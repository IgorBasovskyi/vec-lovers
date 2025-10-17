import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { Spinner } from "../spinner";

interface CustomButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const LoadingButton = ({
  loading = false,
  children,
  ...props
}: CustomButtonProps) => {
  return (
    <Button disabled={loading || props.disabled} {...props}>
      {loading && <Spinner />}
      {children}
    </Button>
  );
};

export { LoadingButton };
