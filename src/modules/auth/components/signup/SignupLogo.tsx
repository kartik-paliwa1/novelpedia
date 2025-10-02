export function SignupLogo() {
    return (
      <div className="flex flex-col items-center mb-8">
        <div className="bg-[#a259ec] p-3 rounded-full mb-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="4" width="16" height="16" rx="4" fill="#fff" />
            <path d="M8 8h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z" fill="#a259ec" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white">Novel Point</h1>
        <p className="text-sm text-violet-200 mt-1">Start your reading journey today</p>
      </div>
    );
  }
  