import React from "react"
import { Link, graphql } from "gatsby"
import parse from "html-react-parser"
import Image from "gatsby-image"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Ghost from "../../content/assets/ghostB.svg"

const BlogIndex = ({
  data,
  pageContext: { nextPagePath, previousPagePath, passedCategory },
}) => {
  const posts = data.allWpPost.nodes

  if (!posts.length) {
    return (
      <Layout>
        <SEO title="Blog" />
        <section className="no-posts">
          <img
            className="ghost-b"
            src={Ghost}
            alt="Bealtaine logo with faded B"
          ></img>
          <p>Something appears to be missing...</p>
          <p>
            You've hit the end of the line for posts in this category. Please
            use the previous button below, or browse to a different section
            through the menu.
          </p>
        </section>
        <div className="archive-nav">
          {previousPagePath && (
            <Link to={previousPagePath} className="prev-blob">
              Previous page
              <svg
                width="136"
                height="69"
                viewBox="0 0 136 69"
                fill="none"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.5 35.6911C0.5 24.557 5 13.4228 14 6C27.5 -5.13418 41 9.71139 50 6C63.5 2.28861 81.5 -5.13418 90.5 9.71139C95 17.1342 108.5 6 122 9.71139C135.5 13.4228 135.5 24.557 135.5 35.6911C135.5 46.8253 131 69.0937 117.5 61.6709C108.5 57.9595 108.5 50.5367 90.5 61.6709C81.5 69.0937 73.3661 72.0416 64.3661 64.6188C55.3661 57.196 30.8661 64.6188 21.8661 64.6188C8.36615 64.6188 0.5 46.8253 0.5 35.6911Z"
                  fill="#F3B61D"
                />
              </svg>
            </Link>
          )}
        </div>
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
          const listingImage = {
            fluid:
              post.listing_image?.listingImage?.localFile?.childImageSharp
                ?.fluid,
            alt: post.listing_image?.listingImage?.alt || ``,
          }
          const category = post.categories.nodes.map(cat => {
            return cat.parentId ? (
              <small key={cat.id} className="post-cat">
                {cat.name}
              </small>
            ) : null
          })

          return (
            <li className="bealtaine-article" key={post.uri}>
              <Link to={post.uri} itemProp="url">
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
                    {post.issue_number?.author && (
                      <small className="post-author">
                        {post.issue_number?.author}
                      </small>
                    )}
                    <small className="post-date">
                      {post.issue_number?.issueNumber
                        ? post.issue_number?.issueNumber
                        : post.date}
                    </small>
                  </header>
                  <div className="cat-container">{category}</div>
                  <div className="article-gradient"></div>
                  {!post.hide_excerpt?.value && (
                    <section className="pullquote" itemProp="description">
                      {parse(post.excerpt)}
                    </section>
                  )}
                  {/* if we have a featured image for this post let's display it */}
                  {listingImage?.fluid ? (
                    <Image
                      className="article-img"
                      fluid={listingImage.fluid}
                      alt={listingImage.alt}
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
              </Link>
            </li>
          )
        })}
      </ol>

      <div className="archive-nav">
        {previousPagePath && (
          <Link to={previousPagePath} className="prev-blob">
            Previous page
            <svg
              width="136"
              height="69"
              viewBox="0 0 136 69"
              fill="none"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.5 35.6911C0.5 24.557 5 13.4228 14 6C27.5 -5.13418 41 9.71139 50 6C63.5 2.28861 81.5 -5.13418 90.5 9.71139C95 17.1342 108.5 6 122 9.71139C135.5 13.4228 135.5 24.557 135.5 35.6911C135.5 46.8253 131 69.0937 117.5 61.6709C108.5 57.9595 108.5 50.5367 90.5 61.6709C81.5 69.0937 73.3661 72.0416 64.3661 64.6188C55.3661 57.196 30.8661 64.6188 21.8661 64.6188C8.36615 64.6188 0.5 46.8253 0.5 35.6911Z"
                fill="#F3B61D"
              />
            </svg>
          </Link>
        )}
        {nextPagePath && (
          <Link to={nextPagePath} className="next-blob">
            Next page
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
          </Link>
        )}
      </div>
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
        issue_number {
          issueNumber
          author
        }
        categories {
          nodes {
            name
            id
            parentId
          }
        }
        hide_excerpt {
          value
        }
        listing_image {
          listingImage {
            mediaItemUrl
            altText
            localFile {
              childImageSharp {
                fluid(maxWidth: 500, quality: 70) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`
