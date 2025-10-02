import Image from "next/image"


export default function TitleWeek() {
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
                    <h2 className="text-5xl font-bold text-white">This Week</h2>
                </div>
                <span className="ml-auto mr-1 text-[14px] font-bold text-[#C084FC]">View All →</span>
            </div>
        </div>
    )
}