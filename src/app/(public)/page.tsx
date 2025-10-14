import Link from "next/link";
import { CustomButton } from "@/components/ui/custom/button";
import { ROUTE } from "@/types/general/client";

const HomePage = () => {
  return (
    <section className="w-full min-h-[calc(100dvh-150px)] flex flex-col justify-center items-center text-center">
      <div className="max-w-3xl px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Collect, Share, and Organize SVG Icons
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Your ultimate space to save, explore, and manage your favorite SVG
          icons.
        </p>
        <CustomButton asChild>
          <Link href={ROUTE.REGISTER}>Get Started</Link>
        </CustomButton>
      </div>
    </section>
  );
};

export default HomePage;
