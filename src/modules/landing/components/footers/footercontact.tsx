import Image from 'next/image';

export default function FooterContacts() {
    return (
        <div className='bg-[#1E293B] w-full p-8 py-10 flex flex-row sm:text-xs md:text-sm lg:text-sm'>
            <div className="basis-[10%] text-white flex justify-center items-center font-bold text-lg">
                <Image
                    src="/logo.svg"
                    alt="Logo Icon"
                    width={36}
                    height={36}
                />
                <span className="logo-title">NovelPedia</span>
            </div>
            <div className='basis-[65%] flex flex-row justify-center items-center gap-10 md:gap-5'>
                <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white">Youth Protection Policy</a>
                <a href="#" className="text-gray-400 hover:text-white">About Us</a>
                <a href="#" className="text-gray-400 hover:text-white">Partnership Guide</a>
                <a href="#" className="text-gray-400 hover:text-white">Creator Site</a>
            </div>

            <div className='flex-grow flex flex-row justify-center items-center gap-4'>
                <a href="#" className="text-gray-400 hover:text-white mr-9">
                    <Image
                        src="/contactLogos/Chat.svg"
                        alt="Chat Icon"
                        width={24}
                        height={24}
                    />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                    <Image
                        src="/contactLogos/youtube.svg"
                        alt="Youtube Icon"
                        width={24}
                        height={24}
                    />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                    <Image
                        src="/contactLogos/instagram.svg"
                        alt="Instagram Icon"
                        width={24}
                        height={24}
                    />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                    <Image
                        src="/contactLogos/twitter.svg"
                        alt="Twitter Icon"
                        width={24}
                        height={24}
                    />
                </a>
                
            </div>    
        </div>
    );
}