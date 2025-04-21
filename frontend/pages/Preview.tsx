
import React from "react";
const Preview = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1EAEDB] to-[#8B5CF6]">
    <div className="bg-white/90 dark:bg-[#1A1F2C]/80 shadow-2xl rounded-2xl p-16 text-center">
      <h1 className="text-3xl font-bold text-[#1A1F2C] dark:text-white mb-4">
        Website Preview
      </h1>
      <iframe
        src="/"
        title="Website Preview"
        className="w-[340px] md:w-[700px] lg:w-[900px] xl:w-[1200px] h-[600px] border-2 rounded-lg"
      />
      <p className="mt-4 text-gray-500 dark:text-gray-300">This is how Info Stream Africa appears to end users.</p>
    </div>
  </div>
);

export default Preview;
