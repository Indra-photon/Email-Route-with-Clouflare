import { SignIn } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Sign In — SyncSupport",
  description: "Sign in to your SyncSupport account to manage email routing, Slack integrations, and customer support tickets.",
  alternates: {
    canonical: "https://www.syncsupport.app/sign-in",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Page() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
        <SignIn />
    </div>
  )
}