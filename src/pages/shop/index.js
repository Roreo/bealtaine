import * as React from "react"
import Layout from "../../components/Layout/layout"
import { graphql } from "gatsby"
import { ProductListing } from "../../components/ProductListing/product-listing"
import Seo from "../../components/Seo/seo"

export default function Products({ data: { products } }) {
  return (
    <Layout>
      <Seo title="All Products" />
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
