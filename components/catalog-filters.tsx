"use client";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import type { Locale } from "@/lib/settings";
import { dictionary } from "@/lib/i18n";
type Props = { locale: Locale; children: React.ReactNode };
export function CatalogFilters({ locale, children }: Props) {
  const [open, setOpen] = useState(false);
  const d = dictionary(locale);
  return (
    <>
      <aside className="desktop-filters">{children}</aside>
      <div className="mobile-filters">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal size={17} />
              {d.filters}
            </Button>
          </DialogTrigger>
          <DialogContent className="drawer filter-drawer" closeLabel={d.close}>
            <DialogTitle className="drawer-title">{d.filters}</DialogTitle>
            <DialogDescription className="sr-only">
              {d.categories} · {d.price}
            </DialogDescription>
            {children}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
