import * as React from "react"
import { graphql, Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import { getShopifyImage } from "gatsby-source-shopify"
import { formatPrice } from "../../utils/format-price"

export function ProductCard({ product, eager }) {
  const {
    title,
    priceRangeV2,
    handle,
    images: [firstImage],
    storefrontImages,
  } = product

  const price = formatPrice(
    priceRangeV2.minVariantPrice.currencyCode,
    priceRangeV2.minVariantPrice.amount
  )

  const defaultImageHeight = 283
  const defaultImageWidth = 200
  let storefrontImageData = {}
  if (storefrontImages) {
    const storefrontImage = storefrontImages.edges[0].node
    try {
      storefrontImageData = getShopifyImage({
        image: storefrontImage,
        layout: "fixed",
        width: defaultImageWidth,
        height: defaultImageHeight,
      })
    } catch (e) {
      console.error(e)
    }
  }

  const hasImage =
    firstImage || Object.getOwnPropertyNames(storefrontImageData || {}).length

  return (
    <Link
      className={"productCardStyle"}
      to={handle}
      aria-label={`View ${title} product page`}
    >
      {hasImage ? (
        <div className={"productImageStyle"} data-name="product-image-box">
          <GatsbyImage
            alt={firstImage?.altText ?? title}
            image={firstImage?.gatsbyImageData ?? storefrontImageData}
            loading={eager ? "eager" : "lazy"}
          />
        </div>
      ) : (
        <div style={{ height: defaultImageHeight, width: defaultImageWidth }} />
      )}
      <div className={"productDetailsStyle"}>
        <h2 as="h2" className={"productHeadingStyle"}>
          {title}
        </h2>
        <div className={"productPrice"}>{price}</div>
      </div>
    </Link>
  )
}

export const query = graphql`
  fragment ProductCard on ShopifyProduct {
    id
    title
    handle
    images {
      id
      altText
      gatsbyImageData(height: 905, width: 640)
    }
    priceRangeV2 {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    vendor
  }
`
