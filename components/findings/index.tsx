import React from 'react'

function Findings( {findings}:any) {
  return (
    <div className="w-full">
        <div className="flex flex-col flex-1 p-4 pb-6">
            {/* <!-- Header for Findings --> */}
            <div className="mb-6 hidden text-white md:inline-flex space-x-2">
              <h1 className="text-xl font-bold">Findings</h1>
              <p className="animate-pulse mt-1">🟢</p>
            </div>
            {/* <!-- Placeholder for Findings Content --> */}
            <div className="flex-1  space-y-6 pr-5">                  
              {findings?.length > 0 ? (
                findings.map((finding: any) => (
                  <div className=" bg-zinc-900 min-h-[76px]  max-w-[300px] flex-cols items-center gap-3 space-y-6 text-white p-6">
                   <button className="rounded-full border-zinc-600 uppercase border-2 text-white text-sm  px-3 py-2 font-semibold">
                      <b className="animate-pulse mx-0.5">
                        {finding.severity === "INFO"
                          ? "🔵"
                          : finding.severity === "MEDIUM"
                          ? "🟠"
                          : finding.severity === "LOW"
                          ? "🟡"
                        : "🔴"}
                      </b>{" "}
                      {finding.severity}
                    </button>
                    <h1 className="text-lg font-semibold">{finding.vulnerability}</h1>
                  </div>
                ))
              ) : (
                <div className="h-full w-full flex justify-center items-center">
                  <h1 className="text-lg font-semibold text-white">No findings</h1>
                </div>
              )}
    
            </div>
            </div>
    </div>
  )
}

export default Findings;