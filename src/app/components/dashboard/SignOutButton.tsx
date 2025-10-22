import { signOut } from '@/app/auth/actions'

export default function SignOutButton() {
  return (
    <form>
      <button
        formAction={signOut}
        className='rounded-md bg-red-600 px-4 py-2 text-white'
      >
        Sign Out
      </button>
    </form>
  )
}
