import Image from "next/image"


export default function TitleLatest() {
    return(
        <div className="flex justify-center">
            <div className="flex w-[95%] flex-row justify-between items-center mb-4">
                <div className="flex flex-row items-center gap-2">
                    <div className="relative w-7 h-15">
                    <Image
                        src="/uiElements/vertical.svg"
                        alt="This Week Icon"
                        // width={7}
                        // height={20}
                        fill
                        className="object-fill"
                    />
                    </div>
                    <h2 className="text-5xl font-bold text-white">Latest Releases</h2>
                </div>
                <span className="ml-auto mr-1 font-bold text-[14px] text-[#C084FC]">View All →</span>
            </div>
        </div>
    )
}