import React from 'react'
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'

function NFTDrop() {
  const connectWithMetaMask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* left */}
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
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
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        {/* header */}
        <header className="flex items-center justify-between">
          <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
            the{' '}
            <span className="font-extrabold underline decoration-pink-600/50">
              codexpath
            </span>{' '}
            nft market place
          </h1>
          <button
            onClick={() => (address ? disconnect() : connectWithMetaMask())}
            className="rounded-full bg-rose-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3"
          >
            {address ? 'sign-out' : 'sign-in with metamask'}
          </button>
        </header>

        <hr className="my-2 border" />

        {address && (
          <p className="text-center text-sm text-rose-400 ">
            you're logged in with the wallet{' '}
            {address.substring(0, 6) +
              '...' +
              address.substring(address.length - 4)}
          </p>
        )}

        {/* content */}

        <div className="mt-10 flex flex-1 flex-col items-center  space-y-6 text-center lg:justify-center lg:space-y-0">
          <img
            src="https://links.papareact.com/bdy"
            alt=""
            className="w-80 object-cover pb-10 lg:h-40"
          />

          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            the codexpath ape nft drop
          </h1>

          <p className="pt-2 text-xl text-green-500">13 / 21 NFTs claimed</p>
        </div>

        {/* mint button */}

        <button className="mt-10 h-16 w-full rounded-full bg-rose-600 font-bold text-white">
          Mint NFT (0.01ETH)
        </button>
      </div>
    </div>
  )
}

export default NFTDrop
