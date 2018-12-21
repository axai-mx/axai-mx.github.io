import React from 'react'
import Helmet from 'react-helmet'
import { Link,graphql } from 'gatsby'
import Image from 'gatsby-image';
import get from 'lodash/get'

import Bio from '../components/Bio'
import Layout from '../components/Layout'
import { rhythm, scale } from '../utils/typography'

class PersonTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = get(this.props, `data.config.frontmatter.title`)
    const siteBio = get(this, 'props.data.config.html')
    const siteDescription = post.excerpt
    const image = post.frontmatter.picture ? <Image sizes={post.frontmatter.picture.childImageSharp.sizes} style={{ borderRadius: '100%', maxWidth: '200px', margin: '1em auto'}}/> : ''
    const posts = get(this, 'props.data.allMarkdownRemark.edges')

    return (
      <Layout location={this.props.location} config={this.props.data.config} translations={post.frontmatter.translations}>
        <Helmet
          htmlAttributes={{ lang: this.props.pageContext.language }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={`${post.frontmatter.title} | ${siteTitle}`}
        />
        <h1>{post.frontmatter.title}</h1>
        {image}
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <h2>Posts</h2>
        <ul>
          {posts.map(({ node }) => {
            const title = get(node, 'frontmatter.title') || node.fields.slug
            return (
              <li key={node.fields.slug}>
                <Link style={{ boxShadow: 'none' }} to={node.fields.slug}>
                  {title}
                </Link>
              </li>
            )
          })}
        </ul>
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <Bio>
          <div dangerouslySetInnerHTML={{ __html: siteBio }} />
        </Bio>
      </Layout>
    )
  }
}

export default PersonTemplate

export const pageQuery = graphql`
  query PersonBySlug($slug: String!, $language: String!, $user: String!) {
    config:markdownRemark(frontmatter: {
      language: { eq: $language }
      type: { eq: "language" }
    }) {
      html
      fields {
        slug
      }
      frontmatter {
        title
        language
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      html
      frontmatter {
        title
        translations
        picture {
          childImageSharp {
            sizes(maxWidth: 200, quality: 90) {
              ...GatsbyImageSharpSizes_noBase64
            }
          }
        }
      }
    }
    allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        filter: { frontmatter: {
          type: { eq: "blog" }
          user: { eq: $user }
        }}
      ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`
