import { Container } from "@/components/Container";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsTableOfContents } from "@/components/docs/DocsTableOfContents";
import { DocSearch } from "@/components/docs/DocSearch";
import { CustomLink } from "@/components/CustomLink";
import { Mail } from "lucide-react";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      {/* <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
        <Container className="py-4">
          <div className="flex items-center justify-between">
            <DocSearch />
          </div>
        </Container>
      </header> */}

      {/* Main Content */}
      <Container className="py-8">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <DocsSidebar />

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <div className="max-w-4xl">{children}</div>
          </main>

          {/* Right Sidebar - Will be populated by page content */}
          <DocsTableOfContents />
        </div>
      </Container>
    </div>
  );
}