import React, { useState } from "react"
import "../../styles/bealtaine.scss"
import styled from "styled-components/macro"
import { Link, useStaticQuery, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
// import Swiper core and required components
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"
import Drawer from "rc-drawer"
import "rc-drawer/assets/index.css"
// Import Swiper styles
import "swiper/swiper.min.css"
import { FiMenu, FiInstagram, FiTwitter, FiChevronRight } from "react-icons/fi"
import CookieConsent from "react-cookie-consent"
// in your cookie banner
import { useLocation } from "@reach/router" // this helps tracking the location
import { StoreContext } from "../../context/store-context" //shopify context
import { CartButton } from "../CartButton/cart-button"
import { Toast } from "../Toast/toast"
import { initializeAndTrack } from "gatsby-plugin-gdpr-cookies"

// install Swiper components
SwiperCore.use([Navigation, Pagination, Autoplay])

const Layout = ({ isHomePage, children }) => {
  const {
    // wp: {
    //   generalSettings: { title },
    // },
    logo,
    home_logo,
    footer,
    footer_logo,
    topPosts,
    menu,
  } = useStaticQuery(graphql`
    query LayoutQuery {
      wp {
        generalSettings {
          title
          description
        }
      }
      logo: file(relativePath: { eq: "Bdark.png" }) {
        childImageSharp {
          gatsbyImageData(
            width: 300
            quality: 100
            placeholder: BLURRED
            layout: CONSTRAINED
          )
        }
      }
      home_logo: file(relativePath: { eq: "bealtaine_home.png" }) {
        childImageSharp {
          gatsbyImageData(
            width: 700
            quality: 100
            placeholder: BLURRED
            layout: CONSTRAINED
          )
        }
      }
      footer: file(relativePath: { eq: "bfooter.png" }) {
        childImageSharp {
          gatsbyImageData(quality: 100, placeholder: NONE, layout: FIXED)
        }
      }
      footer_logo: file(relativePath: { eq: "footer_logo.png" }) {
        childImageSharp {
          gatsbyImageData(
            width: 300
            quality: 100
            placeholder: BLURRED
            layout: CONSTRAINED
          )
        }
      }
      topPosts: allWpPost(
        filter: { top_post: { topPost: { eq: true } } }
        limit: 3
        sort: { fields: top_post___postOrder, order: ASC }
      ) {
        edges {
          node {
            title
            uri
            slug
            top_post {
              description
              customLink
              postOrder
              tpImage {
                altText
                localFile {
                  childImageSharp {
                    gatsbyImageData(
                      quality: 70
                      placeholder: BLURRED
                      layout: FULL_WIDTH
                    )
                  }
                }
              }
            }
          }
        }
      }
      menu: allWpMenu {
        nodes {
          menuItems {
            nodes {
              key: id
              parentId
              title: label
              url
            }
          }
        }
      }
    }
  `)

  const ImageBox = styled.section`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column;
  `

  const Hero = styled.section`
    overflow: visible;
    position: relative;
    display: block;
    height: 500px;
    margin-bottom: 50px;
    @media (max-width: 768px) {
      height: 300px;
    }

    img {
    }

    .hero-link {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: column;
      text-decoration: none;
    }

    h1 {
      color: white;
      text-decoration: none;
    }

    p {
      text-decoration: none;
      color: white;
    }
  `
  const Socials = styled.section`
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: center;
    position: relative;

    .social-icon {
      font-size: 28px;
      margin: 0px 5px;
      color: #182212;
    }
  `

  const { checkout, loading, didJustAddToCart } = React.useContext(StoreContext)

  const items = checkout ? checkout.lineItems : []

  const quantity = items.reduce((total, item) => {
    return total + item.quantity
  }, 0)

  const tpLog = topPosts.edges

  const flatListToHierarchical = (
    data = [],
    { idKey = "key", parentKey = "parentId", childrenKey = "children" } = {}
  ) => {
    const tree = []
    const childrenOf = {}
    data.forEach(item => {
      const newItem = { ...item }
      const { [idKey]: id, [parentKey]: parentId = 0 } = newItem
      childrenOf[id] = childrenOf[id] || []
      newItem[childrenKey] = childrenOf[id]
      parentId
        ? (childrenOf[parentId] = childrenOf[parentId] || []).push(newItem)
        : tree.push(newItem)
    })
    return tree
  }

  const hierarchicalList = flatListToHierarchical(menu.nodes[0].menuItems.nodes)

  const openDropdown = key => {
    document.getElementById(key).classList.toggle("open-sesame")
    document.getElementsByClassName(key)[0].classList.toggle("chevron-turn")
  }

  const menuList = hierarchicalList.map(item => {
    return item.children.length ? (
      <li className="bealtaine-menu-item" key={item.key}>
        <a className="menu-link-dropdown" href={item.url}>
          {item.title}
        </a>
        <FiChevronRight
          className={`dropdown-icon ` + item.key}
          onClick={() => openDropdown(item.key)}
        />
        <ul className="dropdown-menu" id={item.key}>
          {item.children.map(x => (
            <li className="dropdown-item" key={x.title}>
              <a href={x.url}>{x.title}</a>
            </li>
          ))}
        </ul>
      </li>
    ) : (
      <li className="bealtaine-menu-item" key={item.key}>
        <a className="menu-link" href={item.url}>
          {item.title}
        </a>
      </li>
    )
  })

  const heroPosts = tpLog.map(post => (
    <SwiperSlide key={post.node.slug} className="swiper-custom-slide">
      <a
        className="hero-link"
        href={
          post.node.top_post.customLink
            ? post.node.top_post.customLink
            : post.node.uri
        }
        target={post.node.top_post.customLink ? "_blank" : ""}
        rel={post.node.top_post.customLink ? "noreferrer" : ""}
      >
        <div className="article-gradient"></div>
        <GatsbyImage
          image={
            post.node.top_post.tpImage?.localFile?.childImageSharp
              ?.gatsbyImageData
          }
          alt={post.node.top_post.tpImage?.altText}
          className="gatsby-hero-image"
          style={{
            position: "absolute",
            width: "100vw",
            zIndex: -1,
          }}
        />
        <h2>{post.node.title}</h2>
        <p>{post.node.top_post.description}</p>
      </a>
    </SwiperSlide>
  ))

  const MenuFiller = styled.div`
    h1 {
      color: black;
      margin: 0;
    }
  `

  const [open, setOpen] = useState(false)

  const openMenu = () => {
    if (!open) {
      setOpen(true)
      // document.body.classList.add("no-scroll")
    } else {
      setOpen(false)
      // document.body.classList.remove("no-scroll")
    }
  }

  const location = useLocation()

  return (
    <div className="global-wrapper" data-is-root-path={isHomePage}>
      <Drawer
        handler={false}
        open={open}
        onClose={openMenu}
        duration=".3s"
        className="menu-drawer"
      >
        <MenuFiller>
          <ImageBox>
            <Link to="/">
              <GatsbyImage
                image={logo.childImageSharp.gatsbyImageData}
                alt={logo.childImageSharp.alt}
                style={{
                  height: 60,
                  width: 60,
                  marginBottom: 25,
                  marginTop: 25,
                }}
              />
            </Link>
            {/* <h1 className="main-heading">
              <Link to="/">{parse(title)}</Link>
            </h1> */}
          </ImageBox>
          <ul className="bealtaine-menu">{menuList}</ul>
        </MenuFiller>
      </Drawer>
      <header
        className="global-header full-width"
        style={
          isHomePage
            ? null
            : {
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
                marginBottom: 35,
              }
        }
      >
        <div className="container">
          {isHomePage ? (
            <>
              <div className="header-left">
                <FiMenu className="menu-icon" onClick={() => openMenu()} />
              </div>
              <div className="header-center">
                <ImageBox className="logo-wrapper">
                  <Link to="/">
                    <GatsbyImage
                      image={home_logo.childImageSharp.gatsbyImageData}
                      alt={home_logo.childImageSharp.alt}
                      className="nav-logo"
                    />
                  </Link>
                  {/* <h1 className="main-heading">
                <Link to="/">{parse(title)}</Link>
              </h1> */}
                </ImageBox>
              </div>
              <div className="header-right">
                <Socials className="social-box">
                  <CartButton quantity={quantity} />
                  <Toast show={loading || didJustAddToCart}>
                    {!didJustAddToCart ? (
                      "Updating…"
                    ) : (
                      <>
                        Added to cart{" "}
                        <svg
                          width="14"
                          height="14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.019 10.492l-2.322-3.17A.796.796 0 013.91 6.304L6.628 9.14a1.056 1.056 0 11-1.61 1.351z"
                            fill="#fff"
                          />
                          <path
                            d="M5.209 10.693a1.11 1.11 0 01-.105-1.6l5.394-5.88a.757.757 0 011.159.973l-4.855 6.332a1.11 1.11 0 01-1.593.175z"
                            fill="#fff"
                          />
                          <path
                            d="M5.331 7.806c.272.326.471.543.815.163.345-.38-.108.96-.108.96l-1.123-.363.416-.76z"
                            fill="#fff"
                          />
                        </svg>
                      </>
                    )}
                  </Toast>
                </Socials>
              </div>
            </>
          ) : (
            <>
              <div className="header-left">
                <FiMenu className="menu-icon" onClick={() => openMenu()} />
              </div>
              <div className="header-center">
                <ImageBox className="logo-wrapper">
                  <Link to="/">
                    <GatsbyImage
                      image={home_logo.childImageSharp.gatsbyImageData}
                      alt={home_logo.childImageSharp.alt}
                      className="nav-logo"
                    />
                  </Link>
                  {/* <h1 className="main-heading">
                <Link to="/">{parse(title)}</Link>
              </h1> */}
                </ImageBox>
              </div>
              <div className="header-right">
                <Socials className="social-box">
                  <CartButton quantity={quantity} />
                  <Toast show={loading || didJustAddToCart}>
                    {!didJustAddToCart ? (
                      "Updating…"
                    ) : (
                      <>
                        Added to cart{" "}
                        <svg
                          width="14"
                          height="14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.019 10.492l-2.322-3.17A.796.796 0 013.91 6.304L6.628 9.14a1.056 1.056 0 11-1.61 1.351z"
                            fill="#fff"
                          />
                          <path
                            d="M5.209 10.693a1.11 1.11 0 01-.105-1.6l5.394-5.88a.757.757 0 011.159.973l-4.855 6.332a1.11 1.11 0 01-1.593.175z"
                            fill="#fff"
                          />
                          <path
                            d="M5.331 7.806c.272.326.471.543.815.163.345-.38-.108.96-.108.96l-1.123-.363.416-.76z"
                            fill="#fff"
                          />
                        </svg>
                      </>
                    )}
                  </Toast>
                </Socials>
              </div>
            </>
          )}
        </div>
      </header>

      <main>
        {isHomePage ? (
          <Hero className="full-width">
            <Swiper
              slidesPerView={1}
              height={500}
              speed={300}
              autoplay={{ delay: 6000 }}
              loop={true}
              navigation
              className="swiper-custom"
              pagination={{ clickable: true }}
            >
              {heroPosts}
            </Swiper>
          </Hero>
        ) : null}
        {children}
      </main>

      <footer>
        <GatsbyImage
          image={footer.childImageSharp.gatsbyImageData}
          alt={footer.childImageSharp.alt}
          className="footer-bg-img"
        />
        <div className="ftr-wrap">
          <div class="link-box ftr-section">
            <Link className="footer-link" to="/about/">
              About us
            </Link>
            <Link className="footer-link" to="/our-authors-and-artists/">
              Our authors and artists
            </Link>
            <Link className="footer-link" to="/literature/">
              Literature
            </Link>
            <Link className="footer-link" to="/visual-art/">
              Visual art
            </Link>
            <Link className="footer-link" to="/privacy-policy/">
              Privacy policy
            </Link>
          </div>
          <div class="logo-box ftr-section">
            <GatsbyImage
              image={footer_logo.childImageSharp.gatsbyImageData}
              alt={footer_logo.childImageSharp.alt}
              className="footer-center-logo"
            />
            <h2>Bealtaine Magazine</h2>
            <div className="footer-socials">
              <Link
                className="social-link"
                rel="noreferrer"
                target="_blank"
                to="https://www.instagram.com/bealtainemagazine/"
              >
                <FiInstagram className="social-icon" />
              </Link>
              <Link
                className="social-link"
                rel="noreferrer"
                target="_blank"
                to="https://twitter.com/bealtainemag"
              >
                <FiTwitter className="social-icon" />
              </Link>
            </div>
          </div>
        </div>
        <div class="info-box ftr-section">
          <p>
            © {new Date().getFullYear()}, website built by{" "}
            <Link target="_blank" rel="noreferrer" href="https://roryo.co">
              Rory O'Connor{" "}
              <span role="img" aria-label="Lightning bolt emoji">
                ⚡
              </span>
            </Link>
            {` `}
            with
            {` `}
            <Link
              target="_blank"
              rel="noreferrer"
              href="https://www.gatsbyjs.com"
            >
              Gatsby.{" "}
            </Link>
          </p>
          <p>
            Logo design by{" "}
            <Link
              target="_blank"
              rel="noreferrer"
              href="https://www.luciamorenomontero.com/"
            >
              Lucia Moreno Montero.
            </Link>
          </p>
        </div>
      </footer>
      <CookieConsent
        location="bottom"
        buttonText="Accept"
        enableDeclineButton
        declineButtonText="Decline"
        cookieName="gatsby-gdpr-google-analytics"
        style={{
          background: "#213b1f",
          fontSize: "15px",
          padding: "15px",
          display: "flex",
          alignItems: "center",
        }}
        buttonStyle={{}}
        declineButtonStyle={{}}
        onAccept={() => {
          initializeAndTrack(location)
        }}
      >
        This website uses cookies to provide you with the best experience while
        you navigate through the website and to solve any errors that may occur.
        These cookies will be stored in your browser only with your consent. You
        also have the option to opt-out of these cookies. For more information,
        please read our <a href="/privacy-policy/">Privacy Policy</a>.
      </CookieConsent>
    </div>
  )
}

export default Layout
