import * as React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import isEqual from "lodash.isequal"
import { GatsbyImage, getSrc } from "gatsby-plugin-image"
import { StoreContext } from "../context/store-context"
import { AddToCart } from "../components/add-to-cart"
import { NumericInput } from "../components/numeric-input"
import { formatPrice } from "../utils/format-price"
import Seo from "../components/seo"
import { FiChevronRight as ChevronIcon } from "react-icons/fi"

export default function Product({ data: { product, suggestions } }) {
  const {
    options,
    variants,
    variants: [initialVariant],
    priceRangeV2,
    title,
    description,
    images,
    images: [firstImage],
  } = product
  const { client } = React.useContext(StoreContext)

  const [variant, setVariant] = React.useState({ ...initialVariant })
  const [quantity, setQuantity] = React.useState(1)

  const productVariant =
    client.product.helpers.variantForOptions(product, variant) || variant

  const [available, setAvailable] = React.useState(
    productVariant.availableForSale
  )

  const checkAvailablity = React.useCallback(
    productId => {
      client.product.fetch(productId).then(fetchedProduct => {
        const result =
          fetchedProduct?.variants.filter(
            variant => variant.id === productVariant.storefrontId
          ) ?? []

        if (result.length > 0) {
          setAvailable(result[0].available)
        }
      })
    },
    [productVariant.storefrontId, client.product]
  )

  const handleOptionChange = (index, event) => {
    const value = event.target.value

    if (value === "") {
      return
    }

    const currentOptions = [...variant.selectedOptions]

    currentOptions[index] = {
      ...currentOptions[index],
      value,
    }

    const selectedVariant = variants.find(variant => {
      return isEqual(currentOptions, variant.selectedOptions)
    })

    setVariant({ ...selectedVariant })
  }

  React.useEffect(() => {
    checkAvailablity(product.storefrontId)
  }, [productVariant.storefrontId, checkAvailablity, product.storefrontId])

  const price = formatPrice(
    priceRangeV2.minVariantPrice.currencyCode,
    variant.price
  )

  const hasVariants = variants.length > 1
  const hasImages = images.length > 0
  const hasMultipleImages = true || images.length > 1

  return (
    <Layout>
      {firstImage ? (
        <Seo
          title={title}
          description={description}
          image={getSrc(firstImage.gatsbyImageData)}
        />
      ) : undefined}
      <div className={"container product-page"}>
        <div className={"productBox"}>
          {hasImages && (
            <div className={"productImageWrapper"}>
              <div
                role="group"
                aria-label="gallery"
                aria-describedby="instructions"
              >
                <ul className={"productImageList"}>
                  {images.map((image, index) => (
                    <li
                      key={`product-image-${image.id}`}
                      className={"productImageListItem"}
                    >
                      <GatsbyImage
                        objectFit="contain"
                        loading={index === 0 ? "eager" : "lazy"}
                        alt={
                          image.altText
                            ? image.altText
                            : `Product Image of ${title} #${index + 1}`
                        }
                        image={image.gatsbyImageData}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {!hasImages && (
            <span className={"noImagePreview"}>No Preview image</span>
          )}
          <div className="contentBox">
            <h1 className={"header"}>{title}</h1>
            <p className={"productDescription"}>{description}</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="1532"
              height="65"
              preserveAspectRatio="none"
              viewBox="0 0 1532 65"
            >
              <g mask='url("#SvgjsMask1156")' fill="none">
                <path
                  d="M 0,60 C 61.4,53.8 184.2,32.2 307,29 C 429.8,25.8 491.2,46.8 614,44 C 736.8,41.2 798.2,13.4 921,15 C 1043.8,16.6 1105.8,54.4 1228,52 C 1350.2,49.6 1471.2,12.8 1532,3L1532 65L0 65z"
                  fill="rgba(255, 222, 89, 0.6)"
                ></path>
              </g>
              <defs>
                <mask id="SvgjsMask1156">
                  <rect width="1532" height="65" fill="#ffffff"></rect>
                </mask>
              </defs>
            </svg>
          </div>
        </div>
        <div className="detailsBox">
          <div
            as={"h2"}
            style={{ fontSize: 20, marginLeft: 10 }}
            className="productPrice"
          >
            {price}
          </div>

          <div className={"addToCartStyle"}>
            <NumericInput
              aria-label="Quantity"
              onIncrement={() => setQuantity(q => Math.min(q + 1, 20))}
              onDecrement={() => setQuantity(q => Math.max(1, q - 1))}
              onChange={event => setQuantity(event.currentTarget.value)}
              value={quantity}
              min="1"
              max="20"
            />
            <AddToCart
              variantId={productVariant.storefrontId}
              quantity={quantity}
              available={available}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    product: shopifyProduct {
      title
      description
      productType
      handle
      tags
      priceRangeV2 {
        maxVariantPrice {
          amount
          currencyCode
        }
        minVariantPrice {
          amount
          currencyCode
        }
      }
      storefrontId
      images {
        # altText
        id
        gatsbyImageData(layout: CONSTRAINED, width: 640, height: 905)
      }
      variants {
        availableForSale
        storefrontId
        title
        price
        selectedOptions {
          name
          value
        }
      }
      options {
        name
        values
        id
      }
    }
  }
`
