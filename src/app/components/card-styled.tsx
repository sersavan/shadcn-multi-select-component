import * as React from "react";
import { Card } from "@/components/ui/card";

export const CardStyled = ({ children }: React.PropsWithChildren) => {
  return <Card className="w-full max-w-xl p-5">{children}</Card>;
};
