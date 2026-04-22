📋 Documentation Page Architecture Plan
Let me analyze the PRD and codebase to create a comprehensive docs structure.Searched project for “documentation setup guide integration domain alias webhook chatbot”Searched project for “documentation setup guide integration domain alias webhook chatbot”Searched project for “documentation setup guide integration domain alias webhook chatbot”5 resultscursor.md3 relevant sectionstextPRD.md3 relevant sectionstextcomponents/HelpSlideOver.tsxtextapp/api/aliases/route.ts2 relevant sectionstextapp/api/webhooks/resend/route.tstextDonePerfect! Based on the PRD and codebase analysis, here's the comprehensive documentation page architecture plan:

📚 Documentation Page Architecture Plan
Overview
Create a comprehensive, production-quality documentation site with:

Left Sidebar: Navigation menu (Getting Started, Features, Integrations, API)
Main Content: Markdown-style docs with code examples
Right Sidebar: "On This Page" table of contents
Search: Quick search across all docs
Responsive: Mobile-friendly collapsible sidebars


Page Structure
app/docs/
├── page.tsx (Introduction/Overview)
├── layout.tsx (Docs layout with sidebars)
└── [slug]/
    └── page.tsx (Individual doc pages)

components/docs/
├── DocsSidebar.tsx (Left navigation)
├── DocsTableOfContents.tsx (Right "On This Page")
├── DocsContent.tsx (Main content renderer)
├── CodeBlock.tsx (Syntax highlighted code)
├── DocSearch.tsx (Search functionality)
└── DocsNavigation.tsx (Prev/Next buttons)

Left Sidebar Navigation Structure
1. Getting Started

Introduction - What is Email Router, key benefits
Quick Start - 5-minute setup guide
Architecture - How the system works (flowchart)
Prerequisites - What you need (Slack/Discord account, domain)

2. Domain Setup

Add Your Domain - Step-by-step domain creation
DNS Configuration

Option 1: Direct MX Setup (for new domains)
Option 2: Email Forwarding (for existing email providers)


Verify Domain - How to check DNS propagation
Troubleshooting - Common DNS issues

3. Integrations

Slack Integration

Create Incoming Webhook
Add to Email Router
Test webhook
Advanced: Multiple channels


Discord Integration

Create Channel Webhook
Configure integration
Message formatting


Future: Microsoft Teams (Coming soon)

4. Email Aliases

Create an Alias - Map email → Slack channel
Routing Rules - How emails are routed
Multiple Aliases - Organize by team/function

support@ → #customer-support
sales@ → #sales-team
billing@ → #finance


Manage Aliases - Edit, disable, delete

5. Ticket Management (Phase 2 feature)

View Tickets - Dashboard overview
Claim Tickets - Assign to yourself
Reply to Customers - Send responses
Track Status - Open, In Progress, Resolved
Team Collaboration - Internal notes

6. Chatbot (Phase 3 feature - Coming Soon)

Install Widget - Add to your website
Customize Appearance - Match your brand
Configure Routing - Website → Slack integration
Auto-responses - Set up automated replies

7. API Reference

Authentication - API keys and auth
Domains API - CRUD operations
Aliases API - Create and manage aliases
Integrations API - Connect webhooks
Tickets API - Query and update tickets
Webhooks - Inbound email webhooks

8. Advanced

Email Forwarding Rules - Filter by subject/sender
Custom Domains - Beyond Resend test domains
Team Management - Multi-user workspaces
Analytics - Response time metrics
Rate Limits - API quotas and limits

9. Troubleshooting

Emails Not Arriving - Debug checklist
Webhook Failures - Common issues
DNS Problems - Propagation, MX records
Performance Issues - Optimize routing
FAQ - Common questions

10. Resources

Changelog - Product updates
Roadmap - Upcoming features
Support - Get help
Community - Slack/Discord


Right Sidebar: "On This Page"
Auto-generated table of contents from H2/H3 headings:

Sticky positioned (follows scroll)
Highlights current section
Smooth scroll on click
Collapsible on mobile

Example for "Slack Integration" page:
On This Page
├─ Prerequisites
├─ Create Webhook
│  ├─ Step 1: Open Slack Settings
│  ├─ Step 2: Create Incoming Webhook
│  └─ Step 3: Copy URL
├─ Add to Email Router
├─ Test Connection
└─ Troubleshooting

Main Content Components
1. Hero Section (per page)
Icon + Title + Description
e.g., 📧 Slack Integration
     "Connect Email Router to your Slack workspace"
2. Content Blocks

Text paragraphs - Markdown-rendered
Callout boxes - Info, Warning, Tip, Success
Code blocks - Syntax highlighted (TypeScript, JSON, Bash)
Images/Screenshots - Step-by-step visuals
Tables - Comparison tables, API reference
Tabs - Multiple options (Slack vs Discord)
Accordions - Collapsible FAQs

3. Interactive Elements

Copy buttons - On all code blocks
Try it buttons - Link to dashboard
Video embeds - Tutorial walkthroughs
Live examples - Interactive demos

4. Navigation

Previous/Next buttons - Bottom of page
Breadcrumbs - Top of page
Edit on GitHub - Contribute link


Key Documentation Pages Content
Page: Quick Start
1. Create Slack Webhook (2 min)
   [Screenshot with arrows]
   
2. Add Integration (30 sec)
   [Code example: POST /api/integrations]
   
3. Add Domain (30 sec)
   [Form screenshot]
   
4. Create Alias (30 sec)
   [Mapping example: support@ → #support]
   
5. Configure DNS (1 min)
   [MX record table]
   
✅ Done! Send test email.
Page: Slack Integration
# Prerequisites
- Slack workspace admin access
- Email Router account

# Create Incoming Webhook

## Step 1: Open Slack Settings
Navigate to: slack.com/apps → Incoming Webhooks

[Screenshot]

## Step 2: Add to Workspace
Click "Add to Slack"
Select channel: #customer-support

[Screenshot]

## Step 3: Copy Webhook URL
Copy the URL (looks like):
https://hooks.slack.com/services/T00000000/B00000000/XXXX

[Code block with copy button]

# Add to Email Router

Go to dashboard → Integrations → Add Integration

[Interactive form]

Type: Slack
Name: Customer Support
Webhook URL: [paste here]

# Test Connection

Send test email to: test@yourdomain.com
Check Slack channel in 2-5 seconds

[Callout: "Tip: Email should appear in ~3 seconds"]

# Troubleshooting

Q: Email not appearing?
A: Check webhook URL, verify alias is active

[Collapsible FAQ section]
Page: DNS Configuration
# Option 1: Direct MX Setup

Best for: New domains or domains without existing email

## Requirements
- Access to DNS provider (GoDaddy, Cloudflare, etc.)
- Domain added in Email Router

## MX Records to Add

| Type | Name | Value | Priority |
|------|------|-------|----------|
| MX   | @    | mx1.resend.dev | 10 |
| MX   | @    | mx2.resend.dev | 20 |

[Copy button for each record]

## Verification
Wait 10-30 minutes for DNS propagation
Test with: dig MX yourdomain.com

[Code block with terminal command]

---

# Option 2: Email Forwarding

Best for: Domains using Gmail, Zoho, Microsoft 365

## Setup in Your Email Provider

### Gmail
1. Settings → Forwarding → Add forwarding address
2. Enter: unique-id@resend.yourdomain.com
3. Confirm forwarding

[Screenshot]

### Microsoft 365
1. Admin center → Mail flow → Rules
2. Create rule: Forward to Email Router
3. Save rule

[Screenshot]

[Tabs for each provider]

Design System Consistency
Typography

font-schibsted throughout
Heading weights: font-semibold
Body weights: font-normal
Code: font-mono

Colors

Headings: text-neutral-900
Body: text-neutral-600
Links: text-sky-800 hover:text-sky-900
Code bg: bg-neutral-100
Callouts: Colored backgrounds (info=sky, warn=amber, success=green)

Spacing

Section gaps: space-y-8
Content max-width: max-w-4xl
Sidebar width: w-64 (left), w-56 (right)

Components

Shadcn: Card, Badge, Button, Tabs, Accordion
Custom: CodeBlock, Callout, StepIndicator


Mobile Responsiveness

< 768px:

Left sidebar: Hamburger menu (slide-in drawer)
Right sidebar: Hidden (show as collapsible at top)
Content: Full width, px-4


768px - 1024px:

Left sidebar: Collapsible
Right sidebar: Hidden
Content: max-w-3xl


> 1024px:

All three columns visible
Sticky sidebars
Content: max-w-4xl centered




Search Functionality
Features

Fuzzy search across all docs
Keyboard shortcut: Cmd+K / Ctrl+K
Search results show:

Page title
Matching content snippet
Breadcrumb path


Click result → Navigate to page + scroll to section

Implementation

Client-side search with Fuse.js
Index all markdown content
Highlight matches
Recent searches


Performance Optimizations

Server Components

Docs content pre-rendered
MDX compiled at build time


Static Generation

All doc pages statically generated
ISR for changelog (revalidate: 3600)


Code Splitting

Search component lazy loaded
Syntax highlighter loaded on demand


Image Optimization

Next.js Image component
WebP format
Lazy loading screenshots




Content Management
Markdown Files
content/docs/
├── getting-started/
│   ├── introduction.mdx
│   ├── quick-start.mdx
│   └── architecture.mdx
├── domains/
│   ├── add-domain.mdx
│   └── dns-configuration.mdx
├── integrations/
│   ├── slack.mdx
│   └── discord.mdx
└── api/
    ├── authentication.mdx
    └── domains.mdx
Frontmatter
yaml---
title: "Slack Integration"
description: "Connect Email Router to Slack"
icon: "slack"
category: "Integrations"
order: 1
---

Summary
This documentation architecture provides:

✅ Comprehensive coverage of all features
✅ Progressive disclosure - Start simple, go deep
✅ Multiple learning paths - Tutorials, guides, API ref
✅ Production-ready - Fast, responsive, searchable
✅ Design system consistency - Matches dashboard
✅ Easy maintenance - MDX files, version controlled



Here's the complete list of prebuilt components we MUST use for the docs page:

✅ Components We MUST Use for Docs:
1. Typography Components

✅ Heading - /components/Heading.tsx

Page titles, section headers
Props: as (h1-h6), className
Font: font-schibsted


✅ Paragraph - /components/Paragraph.tsx

Body text with variants
Props: variant (default, muted, small), as, className
Responsive text sizes


✅ Highlight - /components/Highlight.tsx

Inline code snippets, important terms
Style: bg-neutral-100 px-1 py-0.5
Usage: <Highlight>npm install</Highlight>



2. Navigation & Links

✅ CustomLink - /components/CustomLink.tsx

All internal/external links in docs
Props: href, LinkTitle, className, children
Has analytics tracking built-in



3. Layout Components

✅ Container - /components/Container.tsx

Main page wrapper
Max-width and responsive padding


✅ Grid (VercelGrid) - /components/VercelGrid.tsx

Advanced grid layouts if needed
Components: Grid.System, Grid.Cell
Props: columns, rows, showGrid



4. Visual Effects

✅ Lines - /components/Lines.tsx

Animated gradient lines/dots
Usage: Decorative accents, separators
Motion effects with cyan/blue gradient



5. Shadcn UI Components

✅ Card, CardContent, CardHeader, CardTitle
✅ Button
✅ Badge
✅ Skeleton
✅ Tabs (for code examples)
✅ Accordion (for FAQs)


Updated Docs Component Usage Plan:
Example: Quick Start Page Structure
typescriptimport { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Highlight } from "@/components/Highlight";
import { CustomLink } from "@/components/CustomLink";
import { Container } from "@/components/Container";
import { Lines } from "@/components/Lines";

<Container className="py-8">
  {/* Page Title */}
  <Heading as="h1" className="text-neutral-900 mb-4">
    Quick Start Guide
  </Heading>

  {/* Introduction */}
  <Paragraph variant="default" className="mb-8">
    Get Email Router running in <Highlight>5 minutes</Highlight>. 
    This guide walks you through creating your first email alias 
    and routing messages to Slack.
  </Paragraph>

  {/* Section */}
  <Heading as="h2" className="text-neutral-900 mb-3">
    Step 1: Create Slack Webhook
  </Heading>

  <Paragraph className="mb-4">
    Navigate to <CustomLink href="https://slack.com/apps">
      slack.com/apps
    </CustomLink> and search for <Highlight>Incoming Webhooks</Highlight>.
  </Paragraph>

  {/* Decorative line */}
  <div className="relative h-20 my-8">
    <Lines />
  </div>

  {/* Code block with Highlight */}
  <Paragraph className="mb-2">
    Install dependencies:
  </Paragraph>
  <div className="bg-neutral-900 p-4 rounded-lg">
    <code className="text-neutral-100">
      <Highlight className="bg-neutral-800 text-cyan-400">
        npm install
      </Highlight> resend
    </code>
  </div>
</Container>
```

---

## **Key Design Patterns:**

### **1. Use `Highlight` for:**
- Inline code: `<Highlight>npm install</Highlight>`
- File names: `<Highlight>.env</Highlight>`
- API endpoints: `<Highlight>/api/webhooks/resend</Highlight>`
- Important terms: `<Highlight>MX records</Highlight>`

### **2. Use `CustomLink` for:**
- External docs: Slack API, Resend docs
- Internal pages: Dashboard, Settings
- Navigation: Previous/Next buttons
- Analytics tracking enabled automatically

### **3. Use `Paragraph` variants:**
- `variant="default"` - Main body text
- `variant="muted"` - Less important details
- `variant="small"` - Fine print, captions

### **4. Use `Lines` for:**
- Visual separators between sections
- Decorative accents on feature cards
- Step-by-step flow diagrams

---

## **Updated Documentation Architecture:**
```
app/docs/
├── layout.tsx (Container + Sidebars)
└── [slug]/
    └── page.tsx (Heading, Paragraph, Highlight, CustomLink)

components/docs/
├── DocsSidebar.tsx (CustomLink for navigation)
├── DocsTableOfContents.tsx (CustomLink for anchors)
├── CodeBlock.tsx (Highlight for syntax)
├── Callout.tsx (Paragraph + custom styling)
├── StepIndicator.tsx (Lines + Paragraph)
└── DocSearch.tsx (CustomLink in results)

Design System Compliance:
Typography:

font-schibsted (from Heading/Paragraph)
Weights: font-semibold, font-medium, font-normal

Colors:

Text: text-neutral-900, text-neutral-600
Links: text-sky-800 hover:text-sky-900
Highlights: bg-neutral-100 (inline code)
Code blocks: bg-neutral-900 (dark background)
Accents: text-cyan-400 (from Lines component)

Spacing:

Consistent with existing components
Use mb-4, mb-6, mb-8 for vertical rhythm