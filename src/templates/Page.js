import React from "react"
import { Link, graphql } from "gatsby"
import Image from "gatsby-image"
import parse from "html-react-parser"

// We're using Gutenberg so we need the block styles
import "@wordpress/block-library/build-style/style.css"
import "@wordpress/block-library/build-style/theme.css"

// import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"

const PageTemplate = ({ data: { previous, next, post } }) => {
  const featuredImage = {
    fluid: post.featuredImage?.node?.localFile?.childImageSharp?.fluid,
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
          <div class="post-cat">{post.category_page?.categoryToShow?.name}</div>
        </div>
        <div className="article-gradient"></div>
        <section className="pullquote" itemProp="description">
          {parse(item.excerpt)}
        </section>
        {/* if we have a featured image for this post let's display it */}
        {item.featuredImage?.node?.localFile?.childImageSharp?.fluid ? (
          <Image
            className="article-img"
            fluid={item.featuredImage.node.localFile.childImageSharp.fluid}
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
        <SEO title={"Home"} description={post.excerpt} />
      ) : (
        <SEO title={post.title} description={post.excerpt} />
      )}

      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{parse(post.title)}</h1>
          {/* if we have a featured image for this post let's display it */}
          {featuredImage?.fluid && (
            <Image
              fluid={featuredImage.fluid}
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

        <hr />

        <footer> {/* <Bio /> */} </footer>
      </article>

      <nav className="blog-post-nav">
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
      </nav>
    </Layout>
  )
}

export default PageTemplate

export const pageQuery = graphql`
  query PageById(
    # these variables are passed in via createPage.pageContext in gatsby-node.js
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    # selecting the current post by id
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
                      fluid(maxWidth: 1000, quality: 100) {
                        ...GatsbyImageSharpFluid_tracedSVG
                      }
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
              fluid(maxWidth: 1000, quality: 100) {
                ...GatsbyImageSharpFluid_tracedSVG
              }
            }
          }
        }
      }
    }
    # this gets us the previous post by id (if it exists)
    previous: wpPage(id: { eq: $previousPostId }) {
      uri
      title
    }
    # this gets us the next post by id (if it exists)
    next: wpPage(id: { eq: $nextPostId }) {
      uri
      title
    }
  }
`
