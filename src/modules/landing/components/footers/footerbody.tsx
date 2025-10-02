export default function FooterBody () {
  return (
    <footer className="bg-[#1a1d2e] text-[#a9b1d6] p-10 w-full text-sm leading-relaxed">
      <div className="mx-auto">
        <div className="space-y-2">
            <p>
            NovelPedia Inc. CEO John Smith | Business registration number 123-45-67890 | Mail order business number 2024-Seoul-0001
            </p>
            <p>
            Address: 123 Digital St, Tech District, Seoul 12345 (Innovation Tower)
            </p>
            <p>
            Customer Center <a href="#" className="text-[#7aa2f7] underline hover:no-underline">
                [1:1 Inquiry]
            </a> 1588-1234 | <a href="mailto:help@novelPedia.com" className="text-[#7aa2f7] underline hover:no-underline">
                help@novelPedia.com
            </a>
            </p>
            <p>
            Operating Hours: Weekdays 10:00 AM - 07:00 PM (Break Time 12:50 PM - 2:10 PM)
            </p>
        </div>

        <hr className="border-t border-[#3b4261] my-6" />

        <div className="space-y-2">
            <p className="text-xs text-[#8a92b2]">
            Caution! Content registered on this site is copyrighted by the site and original copyright holder, and unauthorized copying/transfer/modification/distribution may be subject to legal punishment.
            </p>
            <p className="text-xs text-[#8a92b2]">
            Copyright © NovelPedia 2024. All Rights Reserved.
            </p>
        </div>
      </div>
    </footer>
  );
};

