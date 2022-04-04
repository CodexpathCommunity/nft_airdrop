import { useEffect, useState } from 'react'
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTDrop,
} from '@thirdweb-dev/react'
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { Collections } from '../../typings'
import Link from 'next/link'
import { BigNumber } from 'ethers'
import styled, { keyframes } from 'styled-components'
import toast, { Toaster } from 'react-hot-toast'
import { Modal } from '@material-ui/core'

const lds_ellipsis1 = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
 `

const lds_ellipsis2 = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
 `
const lds_ellipsis3 = keyframes`
   0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
 `
const ElipsDot = styled.div`
  position: relative;
  width: 80px;
  display: flex;
  align-items: center;

  div {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #6b7280;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }

  div:nth-child(1) {
    left: 8px;
    animation: ${lds_ellipsis1} 0.6s infinite;
  }

  div:nth-child(2) {
    left: 8px;
    animation: ${lds_ellipsis2} 0.6s infinite;
  }

  div:nth-child(3) {
    left: 32px;
    animation: ${lds_ellipsis2} 0.6s infinite;
  }

  div:nth-child(4) {
    left: 56px;
    animation: ${lds_ellipsis3} 0.6s infinite;
  }
`

const MaterialModal = styled(Modal)`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

interface Props {
  collections: Collections
}

function NFTDrop({ collections }: Props) {
  const [open, setOpen] = useState<boolean>(false)
  const [claimedSupply, setClaimedSupply] = useState<number>(0)
  const [price, setPrice] = useState<string>()
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [loading, setLoading] = useState<boolean>(true)
  const nftDrop = useNFTDrop(collections.address)
  const [nftDAta, setNftDAta] = useState<any>(null)

  //auth
  const connectWithMetaMask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()

  useEffect(() => {
    if (!nftDrop) return
    const fetchNftDrop = async () => {
      setLoading(true)
      const claimed = await nftDrop.getAllClaimed()
      const total = await nftDrop.totalSupply()
      const claimedConditions = await nftDrop.claimConditions.getAll()

      setClaimedSupply(claimed.length)
      setTotalSupply(total)
      setPrice(claimedConditions[0]?.currencyMetadata.displayValue)
      setLoading(false)
    }
    fetchNftDrop()
  }, [nftDrop])

  const mintNft = () => {
    if (!nftDrop || !address) return
    setLoading(true)
    const notification = toast.loading('Minting NFT...', {
      style: {
        background: 'white',
        color: '#42275a',
        borderRadius: '10px',
        padding: '10px',
        fontSize: '1.2rem',
        fontWeight: 'bold',
      },
    })

    const quantity = 1

    nftDrop
      ?.claimTo(address, quantity)
      .then(async (tx) => {
        toast('you sucessfully minted a hot nft...', {
          duration: 800,
          style: {
            background: 'white',
            color: '#42275a',
            borderRadius: '10px',
            padding: '10px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
          },
        })
        const receipt = tx[0].receipt
        const claimedToken = tx[0].id
        const claimedNft = await tx[0].data()
        console.log(claimedNft)
        setNftDAta(claimedNft)
        setClaimedSupply(claimedSupply + 1)
      })
      .catch((err) =>
        toast('something went wrong...', {
          duration: 800,
          style: {
            background: 'red',
            color: 'white',
            borderRadius: '10px',
            padding: '10px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
          },
        })
      )
      .finally(() => {
        setLoading(false)
        toast.dismiss(notification)
        if (nftDAta) {
          setOpen(true)
        }
      })
  }

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      <Toaster position="bottom-center" />

      <MaterialModal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div
          className="flex h-[90vh] w-[90vw] flex-col items-center rounded-lg bg-slate-100 
       p-8 shadow-xl shadow-rose-400/20 md:w-[60vw] lg:w-[40vw]"
        >
          <img
            src={nftDAta?.metadata?.image}
            alt=""
            className="h-96 w-60 rounded-2xl object-fill"
          />
          <div className="">
            <h1 className="text-center text-4xl font-bold text-[#42275a]">
              {nftDAta?.metadata?.name}
            </h1>
            <h1 className="text-center text-3xl font-semibold text-[#42275a]">
              {nftDAta?.metadata?.description}
            </h1>
          </div>
          <button
            onClick={() => {
              window.open(`https://testnets.opensea.io/account`, '_blank')
            }}
            className="md: mt-auto h-16 w-full rounded-full bg-[#734b6d] font-bold text-white"
          >
            view on open sea
          </button>
        </div>
      </MaterialModal>

      {/* left */}
      <div className="bg-gradient-to-br from-[#42275a] to-[#734b6d] lg:col-span-4">
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
              <span className="font-extrabold text-[#42275a] underline decoration-[#42275a]">
                meta-art
              </span>{' '}
              nft market place
            </h1>
          </Link>
          <button
            onClick={() => (address ? disconnect() : connectWithMetaMask())}
            className="rounded-full bg-[#734b6d] px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3"
          >
            {address ? 'sign-out' : 'sign-in with metamask'}
          </button>
        </header>

        <hr className="my-2 border" />

        {address && (
          <p className="text-center text-sm text-[#42275a] ">
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

          <h1 className="text-3xl font-bold text-[#42275a] lg:text-5xl lg:font-extrabold">
            {collections.title}
          </h1>

          {loading ? (
            <p className="py-4 text-xl text-gray-300">
              loading supply count...
            </p>
          ) : (
            <p className="pt-2 text-xl text-green-500">
              {claimedSupply} / {totalSupply?.toString()} NFTs claimed
            </p>
          )}

          {loading && (
            <ElipsDot>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </ElipsDot>
          )}
        </div>

        {/* mint button */}

        <button
          onClick={mintNft}
          disabled={
            loading || claimedSupply === totalSupply?.toNumber() || !address
          }
          className="mt-10 h-16 w-full rounded-full bg-[#734b6d] font-bold text-white disabled:bg-gray-400 disabled:text-gray-300"
        >
          {loading
            ? 'loading'
            : claimedSupply === totalSupply?.toNumber()
            ? 'soldout'
            : !address
            ? 'login with metamask'
            : ` Mint NFT (${price} ETH)`}
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
