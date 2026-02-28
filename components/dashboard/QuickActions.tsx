import Link from "next/link";

// Shadcn UI components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Icons
import { Plus, Globe, Mail, Zap } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Add Domain",
      description: "Connect a new email domain",
      icon: Globe,
      href: "/dashboard/domains/new",
      color: "bg-sky-100 text-sky-700",
    },
    {
      title: "Add Alias",
      description: "Create a new email alias",
      icon: Mail,
      href: "/dashboard/aliases/new",
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Connect Integration",
      description: "Link Slack or Discord",
      icon: Zap,
      href: "/dashboard/integrations/new",
      color: "bg-green-100 text-green-700",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-neutral-900 font-schibsted">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.title} href={action.href}>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 border-neutral-200 hover:border-sky-800 hover:bg-sky-50 transition-colors"
              >
                <div className={`rounded-md p-2 ${action.color}`}>
                  <Icon className="size-4" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-neutral-900 font-schibsted">
                    {action.title}
                  </p>
                  <p className="text-xs text-neutral-600 font-schibsted font-normal">
                    {action.description}
                  </p>
                </div>
              </Button>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}