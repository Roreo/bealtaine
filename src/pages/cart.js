import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import { StoreContext } from "../context/store-context"
import { LineItem } from "../components/line-item"
import { formatPrice } from "../utils/format-price"
import {
  table,
  wrap,
  totals,
  grandTotal,
  summary,
  checkoutButton,
  collapseColumn,
  labelColumn,
  imageHeader,
  productHeader,
  emptyStateContainer,
  emptyStateHeading,
  emptyStateLink,
  title,
} from "./cart.module.css"

export default function CartPage() {
  const { checkout, loading } = React.useContext(StoreContext)
  const emptyCart = checkout.lineItems.length === 0

  const handleCheckout = () => {
    window.open(checkout.webUrl)
  }

  return (
    <Layout>
      <div className={"cart-wrap"}>
        {emptyCart ? (
          <div className={emptyStateContainer}>
            <h1 className={emptyStateHeading}>Your cart is currently empty</h1>
            <p>Check out our shop for some amazing products:</p>
            <Link to="/shop" className={"emptyStateLink"}>
              View shop
            </Link>
          </div>
        ) : (
          <>
            <h1 className={"title"}>Your cart</h1>
            <table className={table}>
              <thead>
                <tr>
                  <th className={imageHeader}>Image</th>
                  <th className={productHeader}>Product</th>
                  <th className={collapseColumn}>Price</th>
                  <th>Qty.</th>
                  <th className={[totals, collapseColumn].join(" ")}>Total</th>
                </tr>
              </thead>
              <tbody>
                {checkout.lineItems.map(item => (
                  <LineItem item={item} key={item.id} />
                ))}

                <tr className={summary}>
                  <td className={collapseColumn}></td>
                  <td className={collapseColumn}></td>
                  <td className={collapseColumn}></td>
                  <td className={labelColumn}>Subtotal</td>
                  <td className={totals}>
                    {formatPrice(
                      checkout.subtotalPriceV2.currencyCode,
                      checkout.subtotalPriceV2.amount
                    )}
                  </td>
                </tr>
                <tr className={summary}>
                  <td className={collapseColumn}></td>
                  <td className={collapseColumn}></td>
                  <td className={collapseColumn}></td>
                  <td className={labelColumn}>Taxes</td>
                  <td className={totals}>
                    {formatPrice(
                      checkout.totalTaxV2.currencyCode,
                      checkout.totalTaxV2.amount
                    )}
                  </td>
                </tr>
                <tr className={summary}>
                  <td className={collapseColumn}></td>
                  <td className={collapseColumn}></td>
                  <td className={collapseColumn}></td>
                  <td className={labelColumn}>Shipping</td>
                  <td className={totals}>Calculated at checkout</td>
                </tr>
                <tr className={grandTotal}>
                  <td className={collapseColumn}></td>
                  <td className={collapseColumn}></td>
                  <td className={collapseColumn}></td>
                  <td className={labelColumn}>Total Price</td>
                  <td className={totals}>
                    {formatPrice(
                      checkout.totalPriceV2.currencyCode,
                      checkout.totalPriceV2.amount
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className={"checkoutButton next-blob"}
            >
              Checkout
              <svg
                width="135"
                height="67"
                viewBox="0 0 135 67"
                fill="none"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.40803e-05 36.214C1.40803e-05 24.6477 10.8425 11.9247 20.0702 11.9247C33.9118 11.9247 41.5246 9.22591 50.7523 5.37047C64.5938 1.51502 83.0492 -6.19587 92.2769 9.22591C101.505 20.7922 115.346 -6.19587 124.574 9.22591C129.188 16.9368 135 24.6477 135 36.214C135 47.7804 133.802 67.0576 119.96 63.2022C110.732 59.3467 95.968 55.684 86.7403 59.5395C77.5126 63.3949 58.1345 67.0576 53.5206 63.2022C44.2929 55.4913 29.2979 74.7685 20.0702 63.2022C15.4564 55.4913 1.40803e-05 47.7804 1.40803e-05 36.214Z"
                  fill="#F3B61D"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </Layout>
  )
}
