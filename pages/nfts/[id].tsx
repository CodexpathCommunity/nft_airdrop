import React from 'react'
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { Collections } from '../../typings'
import Link from 'next/link'

interface Props {
  collections: Collections
}

function NFTDrop({ collections }: Props) {
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
              src={urlFor(collections.mainImage).url()}
            />
          </div>
          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">
              {collections.nftCollectionName}
            </h1>
            <h1 className="text-xl text-gray-300">{collections.description}</h1>
          </div>
        </div>
      </div>

      {/* right */}
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        {/* header */}
        <header className="flex items-center justify-between">
          <Link href={'/'}>
            <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
              the{' '}
              <span className="font-extrabold underline decoration-pink-600/50">
                babes
              </span>{' '}
              nft market place
            </h1>
          </Link>
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
            src={urlFor(collections.previewImage).url()}
            alt=""
            className="w-80 object-cover pb-10 lg:h-40"
          />

          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            {collections.title}
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `
  *[_type == "collection" && slug.current == $id][0] {
  _id,
  title,
  address,
  description,
  nftCollectionName,
  mainImage {
  asset
},
previewImage{
  asset
},
slug {
  current
},
creator-> {
  _id,
  name,
  address,
  slug {
  current
}
}
}
  `
  const collections = await sanityClient.fetch(query, {
    id: params?.id,
  })

  if (!collections) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      collections,
    },
  }
}
