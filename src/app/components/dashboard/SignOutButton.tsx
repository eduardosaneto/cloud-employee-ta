import { signOut } from "@/app/auth/actions";

export default function SignOutButton() {
  return (
    <form>
      <button
        formAction={signOut}
        className="px-4 py-2 rounded-md bg-red-600 text-white"
      >
        Sign Out
      </button>
    </form>
  );
}
