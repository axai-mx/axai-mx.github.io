const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const caseIndex = path.resolve('./src/templates/case-index.js')
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(
                filter: {frontmatter: {type: {eq: "language"}}}
              ) {
              edges {
                node {
                  frontmatter {
                    language
                  }
                  fields {
                    slug
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        // Create blog posts pages.
        const configs = result.data.allMarkdownRemark.edges;

        _.each(configs, (config) => {
          language = config.node.frontmatter.language
          createPage({
            path: config.node.fields.slug,
            component: caseIndex,
            context: {
              language,
            },
          })
        })
      })
    )

    const blogIndex = path.resolve('./src/templates/blog-index.js')
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(
                filter: {frontmatter: {type: {eq: "blog-index"}}}
              ) {
              edges {
                node {
                  frontmatter {
                    language
                  }
                  fields {
                    slug
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        // Create blog posts pages.
        const configs = result.data.allMarkdownRemark.edges;

        _.each(configs, (config) => {
          language = config.node.frontmatter.language
          createPage({
            path: config.node.fields.slug,
            component: blogIndex,
            context: {
              language,
            },
          })
        })
      })
    )

    const blogPost = path.resolve('./src/templates/blog-post.js')
    _.each(['en', 'es'], (language) => {
      resolve(
        graphql(
          `
            {
              allMarkdownRemark(
                  sort: { fields: [frontmatter___date], order: DESC }, limit: 1000
                  filter: {frontmatter: {
                    language: { eq: "${language}" }
                    type: { eq: "blog" }
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
        ).then(result => {
          if (result.errors) {
            console.log(result.errors)
            reject(result.errors)
          }

          // Create blog posts pages.
          const posts = result.data.allMarkdownRemark.edges;

          _.each(posts, (post, index) => {
            const previous = index === posts.length - 1 ? null : posts[index + 1].node;
            const next = index === 0 ? null : posts[index - 1].node;

            createPage({
              path: post.node.fields.slug,
              component: blogPost,
              context: {
                slug: post.node.fields.slug,
                language,
                previous,
                next,
              },
            })
          })
        })
      )
    })

    const casePost = path.resolve('./src/templates/case-post.js')
    _.each(['en', 'es'], (language) => {
      resolve(
        graphql(
          `
            {
              allMarkdownRemark(
                  sort: { fields: [frontmatter___date], order: DESC }, limit: 1000
                  filter: {frontmatter: {
                    language: { eq: "${language}" }
                    type: { eq: "project" }
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
        ).then(result => {
          if (result.errors) {
            console.log(result.errors)
            reject(result.errors)
          }

          // Create blog posts pages.
          const posts = result.data.allMarkdownRemark.edges;

          _.each(posts, (post, index) => {
            const previous = index === posts.length - 1 ? null : posts[index + 1].node;
            const next = index === 0 ? null : posts[index - 1].node;

            createPage({
              path: post.node.fields.slug,
              component: casePost,
              context: {
                slug: post.node.fields.slug,
                language,
                previous,
                next,
              },
            })
          })
        })
      )
    })

    const person = path.resolve('./src/templates/person.js')
    _.each(['en', 'es'], (language) => {
      resolve(
        graphql(
          `
            {
              allMarkdownRemark(
                  sort: { fields: [frontmatter___date], order: DESC }, limit: 1000
                  filter: {frontmatter: {
                    language: { eq: "${language}" }
                    type: { eq: "user" }
                  }}
                ) {
                edges {
                  node {
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      nick
                    }
                  }
                }
              }
            }
          `
        ).then(result => {
          if (result.errors) {
            console.log(result.errors)
            reject(result.errors)
          }

          // Create blog posts pages.
          const posts = result.data.allMarkdownRemark.edges;

          _.each(posts, (post, index) => {
            createPage({
              path: post.node.fields.slug,
              component: person,
              context: {
                slug: post.node.fields.slug,
                language,
                user: post.node.frontmatter.nick,
              },
            })
          })
        })
      )
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
