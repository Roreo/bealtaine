import * as React from "react"
import { StoreProvider } from "./src/context/store-context"
//Bealtaine styles
import "./src/styles/bealtaine.scss"
// custom typefaces
import "typeface-montserrat"
import "typeface-merriweather"
// normalize CSS across browsers
import "./src/styles/normalize.css"
// custom CSS styles
import "./src/styles/style.css"
//shopify variables
import "./src/styles/variables.css"

export const wrapRootElement = ({ element }) => (
  <StoreProvider>{element}</StoreProvider>
)
