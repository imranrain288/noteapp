import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const Logo = () => {
  return (
    <div className="items-center gap-x-2 md:flex">
     
      
      <p className={cn("font-semibold", font.className)}>NoteApp</p>
    </div>
  );
};
