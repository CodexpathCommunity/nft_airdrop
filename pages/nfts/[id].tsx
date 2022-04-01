import React from 'react'

function NFTDrop() {
  return (
    <div className="flex h-screen flex-col">
      {/* left */}
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              alt=""
              src="https://res.cloudinary.com/dqzqilslm/image/upload/v1648816314/media/images/Emmanuel-Jacob.png"
            />
          </div>
          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">
              codexpath nft collections{' '}
            </h1>
            <h1 className="text-xl text-gray-300">
              a collection of codexpath apes, we live, breathe, mint nfts
            </h1>
          </div>
        </div>
      </div>

      {/* right */}
    </div>
  )
}

export default NFTDrop
