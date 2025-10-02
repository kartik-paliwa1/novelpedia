import { FcGoogle } from 'react-icons/fc';
import { DiApple } from 'react-icons/di';
import { FaXTwitter } from 'react-icons/fa6';
import { FaFacebook } from 'react-icons/fa';

export function SocialButtons() {
  return (
    <div className="w-full flex flex-col gap-3">
      <button className="w-full flex items-center justify-center gap-3 py-2 rounded-lg bg-white/10 border border-violet-700 text-white font-medium hover:bg-white/20 transition">
        <FcGoogle className="text-lg" />
        Continue with Google
      </button>
      <button className="w-full flex items-center justify-center gap-3 py-2 rounded-lg bg-white/10 border border-violet-700 text-white font-medium hover:bg-white/20 transition">
        <DiApple className="text-lg" />
        Continue with Apple
      </button>
      <button className="w-full flex items-center justify-center gap-3 py-2 rounded-lg bg-white/10 border border-violet-700 text-white font-medium hover:bg-white/20 transition">
        <FaXTwitter className="text-lg" />
        Continue with X
      </button>
      <button className="w-full flex items-center justify-center gap-3 py-2 rounded-lg bg-white/10 border border-violet-700 text-white font-medium hover:bg-white/20 transition">
        <FaFacebook className="text-lg" />
        Continue with Facebook
      </button>
    </div>
  );
}