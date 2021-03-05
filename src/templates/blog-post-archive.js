import React from "react"
import { Link, graphql } from "gatsby"
import parse from "html-react-parser"
import Image from "gatsby-image"
import Layout from "../components/layout"
import SEO from "../components/seo"

const BlogIndex = ({
  data,
  pageContext: { nextPagePath, previousPagePath, passedCategory },
}) => {
  const posts = data.allWpPost.nodes

  if (!posts.length) {
    return (
      <Layout>
        <SEO title="Blog" />
        <p>
          No blog posts found. Add posts to your WordPress site and they'll
          appear here!
        </p>
      </Layout>
    )
  }

  return (
    <Layout>
      <SEO
        title={passedCategory.charAt(0).toUpperCase() + passedCategory.slice(1)}
      />
      <ol className="post-box" style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.title
          const featuredImage = {
            fluid: post.featuredImage?.node?.localFile?.childImageSharp?.fluid,
            alt: post.featuredImage?.node?.alt || ``,
          }
          const category = post.categories.nodes.map(cat => {
            return (
              <small key={cat.id} className="post-cat">
                {cat.name}
              </small>
            )
          })

          return (
            <li className="bealtaine-article" key={post.uri}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={post.uri} itemProp="url">
                      <span itemProp="headline">{parse(title)}</span>
                    </Link>
                  </h2>
                  <small className="post-date">{post.date}</small>
                </header>
                <div className="cat-container">{category}</div>
                <div className="article-gradient"></div>
                <section className="pullquote" itemProp="description">
                  {parse(post.excerpt)}
                </section>
                {/* if we have a featured image for this post let's display it */}
                {featuredImage?.fluid ? (
                  <Image
                    className="article-img"
                    fluid={featuredImage.fluid}
                    alt={featuredImage.alt}
                    style={{ marginBottom: 50 }}
                  />
                ) : (
                  <div
                    className="article-bg"
                    style={
                      post.article_bg
                        ? { background: post.article_bg.articleBg }
                        : null
                    }
                  ></div>
                )}
              </article>
            </li>
          )
        })}
      </ol>

      {previousPagePath && (
        <>
          <Link to={previousPagePath}>Previous page</Link>
          <br />
        </>
      )}
      {nextPagePath && <Link to={nextPagePath}>Next page</Link>}
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query WordPressPostArchive(
    $offset: Int!
    $postsPerPage: Int!
    $passedCategory: String!
  ) {
    allWpPost(
      sort: { fields: [date], order: DESC }
      limit: $postsPerPage
      skip: $offset
      filter: {
        categories: { nodes: { elemMatch: { slug: { eq: $passedCategory } } } }
      }
    ) {
      nodes {
        excerpt
        uri
        date(formatString: "MMMM DD, YYYY")
        title
        excerpt
        article_bg {
          articleBg
        }
        categories {
          nodes {
            name
            id
          }
        }
        featuredImage {
          node {
            mediaItemUrl
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
`
