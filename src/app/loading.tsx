import { Spinner } from "@/components/ui/spinner";

const Loading = () => (
  <div className="absolute flex w-dvw h-dvh flex-col justify-center items-center text-center bg-background">
    <Spinner />
  </div>
);

export default Loading;
