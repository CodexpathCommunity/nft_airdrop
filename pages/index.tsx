import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor, sanityClient } from '../sanity'
import { Collections } from '../typings'

interface Props {
  collections: Collections[]
}

const Home = ({ collections }: Props) => {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col py-20 px-10 2xl:px-0">
      <Head>
        <title>NFT AirDrop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="space-y-2 p-5 text-center">
        <h1 className="text-4xl font-bold text-white">
          babes nft collections{' '}
        </h1>
        <h1 className="text-xl text-gray-300">
          a collection of hot babes to grab as nfts
        </h1>
      </div>

      <main className="bg-slate-100 p-10 shadow-xl shadow-rose-400/20">
        <div className="grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {collections.map((collection) => (
            <Link href={`/nfts/${collection.slug.current}`}>
              <div className="flex cursor-pointer flex-col items-center justify-center text-center transition-all duration-200 hover:scale-105">
                <img
                  src={urlFor(collection.mainImage).url()}
                  alt=""
                  className="h-96 w-60 rounded-2xl object-cover"
                />

                <div className="p-5">
                  <h2 className="text-3xl">{collection.title}</h2>
                  <p className="mt-2 text-xl text-gray-400">
                    {collection.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `
  *[_type == "collection"]{
  _id,
  title,
  address,
  description,
  mainImage {
  asset
},
nftCollectionName,
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
  const collections = await sanityClient.fetch(query)
  console.log(collections)

  return {
    props: {
      collections,
    },
  }
}
