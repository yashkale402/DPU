import { GraduationCap } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2 p-2">
      <GraduationCap className="h-6 w-6 text-primary" />
      <h1 className="text-xl font-bold text-primary">CampusConnect</h1>
    </div>
  );
}
