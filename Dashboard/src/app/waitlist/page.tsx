export default function WaitlistPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center text-white">
        <h1 className="text-3xl font-bold mb-4">You're on the Waitlist 🎉</h1>
        <p className="text-lg mb-6">
          Thanks for signing up! We’ll send you an email with updates soon.
        </p>
      </div>
    </div>
  )
}
