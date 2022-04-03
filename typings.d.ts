interface Image {
  asset: {
    url: string
  }
}

export interface Creator {
  _id: string
  name: string
  address: string
  slug: {
    current: string
  }
  image: Image
  bio: string
}

export interface Collections {
  _id: string
  title: string
  address: string
  description: string
  creator: Creator
  nftCollectionName: sting
  mainImage: Image
  previewImage: image
  slug: {
    current: string
  }
}
