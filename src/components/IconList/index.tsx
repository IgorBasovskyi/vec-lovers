"use server";

import { TIconSVG } from "@/types/icon/general";
import IconCard from "../IconCard";
import CustomEmpty from "../ui/custom/empty";
import { Plus } from "lucide-react";

interface Icon {
  id: string;
  title: string;
  description?: string | null;
  svgIcon: TIconSVG;
  category?: string | null;
}

interface IconsListProps {
  icons: Icon[];
}

const IconsList = async ({ icons }: IconsListProps) => {
  if (icons.length === 0) {
    return (
      <CustomEmpty
        title="No icons found"
        description="You haven't added any icons yet. Start building your collection by adding your first icon."
        icon={<Plus className="h-6 w-6" />}
      />
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {icons.map((icon) => (
        <li key={icon.id}>
          <IconCard
            title={icon.title}
            description={icon.description}
            svgIcon={icon.svgIcon}
            category={icon.category}
          />
        </li>
      ))}
    </ul>
  );
};

export default IconsList;
