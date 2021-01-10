import React, { useState } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
// import parse from "html-react-parser"
import Image from "gatsby-image"
import styled from "styled-components/macro"
import "../bealtaine.scss"
// import Swiper core and required components
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"
import Drawer from "rc-drawer"
import "rc-drawer/assets/index.css"
// Import Swiper styles
import "swiper/swiper.min.css"
import {
  FiMenu,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiFacebook,
  FiChevronRight,
} from "react-icons/fi"

// install Swiper components
SwiperCore.use([Navigation, Pagination, Autoplay])

const Layout = ({ isHomePage, children }) => {
  const {
    // wp: {
    //   generalSettings: { title },
    // },
    file,
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
      file(relativePath: { eq: "logov2.png" }) {
        childImageSharp {
          fluid(maxWidth: 1000, quality: 100) {
            src
          }
        }
      }
      topPosts: allWpPost(
        filter: { top_post: { topPost: { eq: true } } }
        limit: 3
        sort: { fields: date, order: DESC }
      ) {
        edges {
          node {
            title
            uri
            slug
            top_post {
              description
            }
            featuredImage {
              node {
                altText
                localFile {
                  childImageSharp {
                    fluid(maxWidth: 1800, quality: 70) {
                      src
                    }
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

    .social-icon {
      font-size: 22px;
      margin: 0px 5px;
    }
  `

  const CoverImage = styled.section`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: -1;

    img {
      display: block;
      width: 1000;
      height: auto;
    }
  `

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
      <a className="hero-link" href={post.node.uri}>
        <Image
          fluid={post.node.featuredImage.node.localFile.childImageSharp.fluid}
          alt={post.node.featuredImage.node.altText}
          className="gatsby-hero-image"
          style={{
            position: "absolute",
            width: "100vw",
            zIndex: -1,
          }}
        />
        <h1>{post.node.title}</h1>
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
      document.body.classList.toggle("no-scroll")
    } else {
      setOpen(false)
      document.body.classList.toggle("no-scroll")
    }
  }

  return (
    <div className="global-wrapper" data-is-root-path={isHomePage}>
      <main>
        <CoverImage>
          <Image
            fluid={file.childImageSharp.fluid}
            style={{
              position: "absolute",
              width: "500px",
              height: "250px",
              zIndex: -1,
            }}
          />
        </CoverImage>
      </main>
    </div>
  )
}

export default Layout
