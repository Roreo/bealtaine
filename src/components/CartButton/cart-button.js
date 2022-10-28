import * as React from "react"
import { Link } from "gatsby"
import { FiShoppingBag } from "react-icons/fi"

export function CartButton({ quantity }) {
  return (
    <Link
      aria-label={`Shopping Cart with ${quantity} items`}
      to="/cart"
      className={"cartButton"}
    >
      <FiShoppingBag />
      {quantity > 0 && <div className={"badge"}>{quantity}</div>}
    </Link>
  )
}
