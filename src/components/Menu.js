import React from 'react'
import { Link, StaticQuery, graphql } from "gatsby"

class Menu extends React.Component {
  render() {
    const { language } = this.props
    return (
      <StaticQuery
        query={graphql`
          query MenuQuery {
            allMarkdownRemark(
              filter: { frontmatter: { type: {in: ["language", "blog-index"]}}},
              sort: { fields: [frontmatter___type], order: DESC }
            ) {
              edges {
                node {
                  fields {
                    slug
                  }
                  frontmatter {
                    language
                    menu_label
                    title
                  }
                }
              }
            }
          }
        `}
        render={data => (
          <ul style={{ listStyle: `none`, marginBottom: 0 }}>
            {data.allMarkdownRemark.edges.map(({ node }) => {
              if (node.frontmatter.language != language) {
                return
              } else {
                return (
                  <li key={node.fields.slug} style={{ display: `inline-block`, margin: `0 1rem 0 0` }}>
                    <Link style={{
                      boxShadow: 'none',
                      textDecoration: 'none',
                    }} to={node.fields.slug} title={node.frontmatter.title}>
                      {node.frontmatter.menu_label}
                    </Link>
                  </li>
                )
              }
            })}
          </ul>
        )}
      />
    )
  }
}

export default Menu
