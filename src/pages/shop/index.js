import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../../components/layout"
import { ProductListing } from "../../components/product-listing"
import SEO from "../../components/seo"
import { MoreButton } from "../../components/more-button"
import { title } from "./index.module.css"

export default function Products({ data: { products } }) {
  return (
    <Layout>
      <SEO title="All Products" />
      <div className={"container product-listing-page"}>
        <h1>Shop</h1>
        <ProductListing products={products.nodes} />
      </div>
    </Layout>
  )
}

export const query = graphql`
  {
    products: allShopifyProduct(
      sort: { fields: updatedAt, order: ASC }
      limit: 24
    ) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`