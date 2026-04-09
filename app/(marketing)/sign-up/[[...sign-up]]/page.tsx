import { SignUp } from '@clerk/nextjs'
import { SignupPageTracker } from '@/components/SignupPageTracker'

export default function Page() {
  return (
      <div className='min-h-screen flex items-center justify-center'>
          <SignupPageTracker />
          <SignUp />
      </div>
    )
}