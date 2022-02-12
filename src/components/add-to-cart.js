import * as React from "react"
import { StoreContext } from "../context/store-context"
import { addToCart as addToCartStyle } from "./add-to-cart.module.css"

export function AddToCart({ variantId, quantity, available, ...props }) {
  const { addVariantToCart, loading } = React.useContext(StoreContext)

  function addToCart(e) {
    e.preventDefault()
    addVariantToCart(variantId, quantity)
  }

  return (
    <button
      type="submit"
      className={"next-blob"}
      onClick={addToCart}
      disabled={!available || loading}
      {...props}
    >
      {available ? "Add to Cart" : "Out of Stock"}
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
  )
}
