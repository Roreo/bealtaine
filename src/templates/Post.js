import React from "react"
import { Link, graphql } from "gatsby"
import Image from "gatsby-image"
import parse from "html-react-parser"
// We're using Gutenberg so we need the block styles
import "@wordpress/block-library/build-style/style.css"
import "@wordpress/block-library/build-style/theme.css"
import Layout from "../components/layout"
import SEO from "../components/seo"

const BlogPostTemplate = ({ data: { previous, next, post } }) => {
  const featuredImage = {
    fluid: post.featuredImage?.node?.localFile?.childImageSharp?.fluid,
    alt: post.featuredImage?.node?.alt || ``,
  }

  return (
    <Layout>
      <SEO title={post.title} description={post.excerpt} />

      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{parse(post.title)}</h1>

          <p>
            {post.issue_number?.issueNumber
              ? post.issue_number?.issueNumber
              : post.date}
          </p>

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
      </article>

      <nav className="blog-post-nav">
        <h2>More posts</h2>
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
              <Link to={previous.uri} className="prev-blob" rel="prev">
                <span role="img" aria-label="Previous post">
                  ←
                </span>{" "}
                {parse(previous.title)}
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
          </li>

          <li>
            {next && (
              <Link to={next.uri} className="next-blob" rel="next">
                {parse(next.title)}{" "}
                <span role="img" aria-label="Next post">
                  →
                </span>
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
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostById(
    # these variables are passed in via createPage.pageContext in gatsby-node.js
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    # selecting the current post by id
    post: wpPost(id: { eq: $id }) {
      id
      excerpt
      content
      title
      date(formatString: "MMMM DD, YYYY")
      issue_number {
        issueNumber
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

    # this gets us the previous post by id (if it exists)
    previous: wpPost(id: { eq: $previousPostId }) {
      uri
      title
    }

    # this gets us the next post by id (if it exists)
    next: wpPost(id: { eq: $nextPostId }) {
      uri
      title
    }
  }
`
