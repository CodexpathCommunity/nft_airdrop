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
    <div className="bg-gradient-to-br from-[#42275a] to-[#734b6d]">
      <Head>
        <title>NFT AirDrop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col  shadow-[#42275a] 2xl:px-0">
        <header className="relative flex h-screen flex-col items-center justify-center bg-[url('/images/001.png')] bg-cover p-6 lg:h-[80vh]">
          <h1 className="text-center text-6xl font-extrabold leading-[5rem] text-[white] lg:text-6xl ">
            Discover and Collect Super Rare Digital Artworks and NFTs
          </h1>
          <h1 className="absolute top-2 left-2 text-4xl font-bold text-[#42275a]">
            META- <span className="text-[#734b6d]">ART</span>{' '}
          </h1>
        </header>

        <main className=" p-10 shadow-xl shadow-[#42275a]">
          <div className="grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {collections.map((collection) => (
              <Link
                href={`/nfts/${collection.slug.current}`}
                key={collection.slug.current}
              >
                <div className="flex cursor-pointer flex-col items-center justify-center text-center transition-all duration-200 hover:scale-105">
                  <img
                    src={urlFor(collection.mainImage).url()}
                    alt=""
                    className="h-96 w-60 rounded-2xl object-cover"
                  />

                  <div className="p-5">
                    <h2 className="text-3xl text-white">{collection.title}</h2>
                    <p className="mt-2 text-xl text-gray-400">
                      {collection.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>

        <footer className="flex items-center justify-center p-4">
          <p className="text-white">made with love by Emmanuel Jacob</p>
        </footer>
      </div>
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
