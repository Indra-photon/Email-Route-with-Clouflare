import { SignUp } from '@clerk/nextjs'
import { SignupPageTracker } from '@/components/SignupPageTracker'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Sign Up — SyncSupport",
  description: "Create your SyncSupport account and start routing customer support emails to Slack in under 5 minutes. No credit card required.",
  alternates: {
    canonical: "https://www.syncsupport.app/sign-up",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Page() {
  return (
      <div className='min-h-screen flex items-center justify-center'>
          <SignupPageTracker />
          <SignUp />
      </div>
    )
}