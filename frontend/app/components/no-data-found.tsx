import { Button } from "@/components/ui/button";
import { CirclePlus, LayoutGrid, type LucideIcon } from "lucide-react";

interface NoDataFoundProps {
  title: string;
  description: string;
  buttonText: string;
  buttonAction: () => void;
  icon?: LucideIcon;
}

export const NoDataFound = ({
  title,
  description,
  buttonText,
  buttonAction,
  icon: Icon = LayoutGrid,
}: NoDataFoundProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] col-span-full py-12 text-center bg-muted/40 border border-dashed rounded-lg p-8 animate-in fade-in-50">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Icon className="size-10 text-muted-foreground" />
      </div>

      <h3 className="mt-6 text-xl font-semibold tracking-tight">{title}</h3>

      <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto text-balance">
        {description}
      </p>

      <Button onClick={buttonAction} className="mt-6" size="lg">
        <CirclePlus className="size-4 mr-2" />
        {buttonText}
      </Button>
    </div>
  );
};
