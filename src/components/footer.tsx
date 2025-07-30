import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-6 mt-12 bg-card border-t">
      <div className="container max-w-7xl flex items-center justify-center text-sm text-muted-foreground">
        <p className="flex items-center gap-1.5">
          Made with <Heart className="h-4 w-4 text-red-500 fill-current" /> by
          Ganesh Tidake & Yash Kale
        </p>
      </div>
      <span className=" flex w-full max-w-7xl justify-center mt-4 text-center items-center text-xs  hover:text-gray-700 text-muted-foreground">
        <Link href="/login">Admin Login</Link>
      </span>
    </footer>
  );
}
