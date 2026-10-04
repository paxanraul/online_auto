"use client";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
export const Tabs = TabsPrimitive.Root;
export function TabsList(p: React.ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List {...p} className={cn("tabs-list", p.className)} />;
}
export function TabsTrigger(
  p: React.ComponentProps<typeof TabsPrimitive.Trigger>,
) {
  return (
    <TabsPrimitive.Trigger {...p} className={cn("tabs-trigger", p.className)} />
  );
}
export function TabsContent(
  p: React.ComponentProps<typeof TabsPrimitive.Content>,
) {
  return (
    <TabsPrimitive.Content {...p} className={cn("tabs-content", p.className)} />
  );
}
