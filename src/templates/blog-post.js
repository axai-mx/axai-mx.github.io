import React from 'react'
import Helmet from 'react-helmet'
import { Link,graphql } from 'gatsby'
import Image from 'gatsby-image';
import get from 'lodash/get'

import Bio from '../components/Bio'
import Layout from '../components/Layout'
import { rhythm, scale } from '../utils/typography'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = get(this.props, `data.config.frontmatter.title`)
    const siteBio = get(this, 'props.data.config.html')
    const siteDescription = post.excerpt
    const { previous, next } = this.props.pageContext
    const image = post.frontmatter.image ? <Image sizes={post.frontmatter.image.childImageSharp.sizes} /> : ''
    const language = this.props.pageContext.language
    const userLink = `${language}/` + (language == 'es' ? 'personas' : 'people') + `/${post.frontmatter.user}`

    return (
      <Layout location={this.props.location} config={this.props.data.config} translations={post.frontmatter.translations}>
        <Helmet
          htmlAttributes={{ lang: this.props.pageContext.language }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={`${post.frontmatter.title} | ${siteTitle}`}
        />
        <h1>{post.frontmatter.title}</h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: 'block',
            marginBottom: rhythm(1),
            marginTop: rhythm(-1),
          }}
        >
          <Link to={userLink}>{post.frontmatter.user}</Link> - {post.frontmatter.date}
        </p>
        {image}
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <Bio>
          <div dangerouslySetInnerHTML={{ __html: siteBio }} />
        </Bio>

        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            listStyle: 'none',
            padding: 0,
          }}
        >
          <li>
            {
              previous &&
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            }
          </li>
          <li>
            {
              next &&
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            }
          </li>
        </ul>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!, $language: String!) {
    config:markdownRemark(frontmatter: {
      language: { eq: $language }
      type: { eq: "blog-index" }
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
        user
        date(formatString: "MMMM DD, YYYY")
        translations
        image {
          childImageSharp {
            sizes(maxWidth: 640, quality: 90) {
              ...GatsbyImageSharpSizes_noBase64
            }
            resize(width: 420) {
              src
            }
          }
        }
      }
    }
  }
`
