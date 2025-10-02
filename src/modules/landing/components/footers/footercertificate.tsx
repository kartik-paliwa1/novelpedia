export default function CertificationsFooter () {
  return (
    // Main container with the dark background and responsive padding
    <div className="bg-[#1a1d2e] w-full px-6 py-8 md:p-10">
      {/* 
        - Flex container to manage layout and spacing.
        - Stacks vertically on mobile (flex-col).
        - Switches to a horizontal layout on medium screens (md:flex-row).
        - Centers items on mobile and aligns them at the start on larger screens.
      */}
      <div className="mx-auto flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12">
        
        {/* 1. Tech Innovation Certification */}
        <div className="flex items-center space-x-4">
          {/* Blue Icon Box */}
          <div className="flex-shrink-0 w-16 h-16 bg-[#3b82f6] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">TECH</span>
          </div>
          {/* Text Content */}
          <div>
            <p className="font-bold text-white">INNOVATE</p>
            <p className="text-sm text-[#a9b1d6]">Technology Innovation</p>
            <p className="text-sm text-[#a9b1d6]">Small and Medium Business Certification</p>
          </div>
        </div>

        {/* 2. Clean Copyright Certification */}
        <div className="flex items-center space-x-4">
          {/* Green Icon Box */}
          <div className="flex-shrink-0 w-16 h-16 bg-[#22c55e] rounded-xl flex items-center justify-center">
            <span className="text-white text-4xl">©</span>
          </div>
          {/* Text Content */}
          <div>
            <p className="font-bold text-white">Clean Copyright</p>
            <p className="text-sm text-[#a9b1d6]">Copyright OK</p>
          </div>
        </div>

      </div>
    </div>
  );
};

