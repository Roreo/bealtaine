import React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import parse from "html-react-parser"

// We're using Gutenberg so we need the block styles
import "@wordpress/block-library/build-style/style.css"
import "@wordpress/block-library/build-style/theme.css"

// import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const PageTemplate = ({ data: { previous, next, post } }) => {
  const featuredImage = {
    fluid:
      post.featuredImage?.node?.localFile?.childImageSharp?.gatsbyImageData,
    alt: post.featuredImage?.node?.alt || ``,
  }

  const cat_posts = post.category_page?.categoryToShow?.posts.nodes

  const catListing = cat_posts?.map(item => (
    <li className="bealtaine-article" key={item.uri}>
      <article
        className="post-list-item"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h2>
            <Link to={item.uri} itemProp="url">
              <span itemProp="headline">{parse(item.title)}</span>
            </Link>
          </h2>
          <small className="post-date">{item.author.node.name}</small>
        </header>
        <div className="cat-container">
          <div className="post-cat">
            {post.category_page?.categoryToShow?.name}
          </div>
        </div>
        <div className="article-gradient"></div>
        <section className="pullquote" itemProp="description">
          {parse(item.excerpt)}
        </section>
        {/* if we have a featured image for this post let's display it */}
        {item.featuredImage?.node?.localFile?.childImageSharp
          ?.gatsbyImageData ? (
          <GatsbyImage
            image={
              item.featuredImage.node.localFile.childImageSharp.gatsbyImageData
            }
            className="article-img"
            alt={item.featuredImage.node.alt}
            style={{ marginBottom: 50, height: "100%" }}
          />
        ) : (
          <div
            className="article-bg"
            style={
              item.article_bg ? { background: item.article_bg.articleBg } : null
            }
          ></div>
        )}
      </article>
    </li>
  ))

  return (
    <Layout isHomePage={post.isFrontPage}>
      {post.isFrontPage ? (
        <Seo title={"Home"} description={post.excerpt} />
      ) : (
        <Seo title={post.title} description={post.excerpt} />
      )}

      <article
        className={`blog-post ` + (post.isFrontPage ? "front-page" : "")}
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 className="page-main-title" itemProp="headline">
            {parse(post.title)}
          </h1>
          {/* if we have a featured image for this post let's display it */}
          {featuredImage?.fluid && (
            <GatsbyImage
              image={featuredImage.gatsbyImageData}
              alt={featuredImage.alt}
              style={{ marginBottom: 50 }}
            />
          )}
        </header>

        {!!post.content && (
          <section itemProp="articleBody">{parse(post.content)}</section>
        )}

        {post.category_page.isCategoriesPage && (
          <ol className="post-box" style={{ listStyle: `none` }}>
            {catListing}
          </ol>
        )}
      </article>

      {/* <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.uri} rel="prev">
                ← {parse(previous.title)}
              </Link>
            )}
          </li>

          <li>
            {next && (
              <Link to={next.uri} rel="next">
                {parse(next.title)} →
              </Link>
            )}
          </li>
        </ul>
      </nav> */}
    </Layout>
  )
}

export default PageTemplate

export const pageQuery = graphql`
  query PageById($id: String!, $previousPostId: String, $nextPostId: String) {
    post: wpPage(id: { eq: $id }) {
      id
      isFrontPage
      content
      title
      category_page {
        isCategoriesPage
        categoryToShow {
          name
          posts {
            nodes {
              title
              uri
              excerpt
              author {
                node {
                  name
                }
              }
              categories {
                nodes {
                  name
                }
              }
              date
              article_bg {
                articleBg
              }
              featuredImage {
                node {
                  altText
                  localFile {
                    childImageSharp {
                      gatsbyImageData(
                        quality: 100
                        placeholder: TRACED_SVG
                        layout: FULL_WIDTH
                      )
                    }
                  }
                }
              }
            }
          }
        }
      }
      date(formatString: "MMMM DD, YYYY")
      featuredImage {
        node {
          altText
          localFile {
            childImageSharp {
              gatsbyImageData(
                quality: 100
                placeholder: TRACED_SVG
                layout: FULL_WIDTH
              )
            }
          }
        }
      }
    }
    previous: wpPage(id: { eq: $previousPostId }) {
      uri
      title
    }
    next: wpPage(id: { eq: $nextPostId }) {
      uri
      title
    }
  }
`
