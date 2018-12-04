import React from 'react'
import styled from "styled-components"
import { Link, graphql } from 'gatsby'
import Image from 'gatsby-image';
import get from 'lodash/get'
import sample from 'lodash/sample';
import Helmet from 'react-helmet'

import Bio from '../components/Bio'
import Layout from '../components/Layout'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  width: 100%;
  margin: 2rem 0;
`;

const Item = styled.div`
  position: relative;
  &:before {
    content: '';
    display: block;
    padding-top: 100%;
  }
`;

const Content = styled.div`
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  a {
    color: #fff;
    height: 100%;
    left: 0;
    opacity: 0;
    padding: 2rem;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 10;
    transition: all 0.3s ease-in-out;
    text-decoration: none;
    &:hover {
      color: #fff;
      opacity: 1;
      text-decoration: none;
    }
  }
`;

const ImageWrapper = styled.div`
  > div {
    height: 100%;
    left: 0;
    position: absolute !important;
    top: 0;
    width: 100%;
    > div {
      position: static !important;
    }
  }
`;

const Overlay = styled.div`
  background-color: #f89b33;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: -1;
`;

const overlay = ['#f76262', '#216583', '#65c0ba', '#35477d', '#6c5b7b', '#203541', '#9951ff', '#480032'];

class CaseIndex extends React.Component {
  render() {
    const config = get(this, 'props.data.config')
    const posts = get(this, 'props.data.allMarkdownRemark.edges')
    const siteTitle = get(config, 'frontmatter.title')
    const description = get(config, 'frontmatter.description')
    const bio = get(config, 'html')

    return (
      <Layout location={this.props.location} config={config}>
        <Helmet
          htmlAttributes={{ lang: this.props.pageContext.language }}
          meta={[{ name: 'description', content: description }]}
          title={siteTitle}
        />
        <Bio>
          <div dangerouslySetInnerHTML={{ __html: bio }} />
        </Bio>
        <Wrapper>
          {posts.map(({ node }) => {
            const overlayColor = sample(overlay);
            const title = get(node, 'frontmatter.title') || node.fields.slug
            return (
              <Item key={node.fields.slug}>
                <Content>
                  <ImageWrapper>
                    <Image fluid={node.frontmatter.image.childImageSharp.fluid} />
                  </ImageWrapper>
                  <Link style={{ boxShadow: 'none' }} to={node.fields.slug}>
                    <Overlay style={{ backgroundColor: overlayColor }} />
                    <h2>{title}</h2>
                    <div>{node.frontmatter.projectInfo}</div>
                  </Link>
                </Content>
              </Item>
            )
          })}
        </Wrapper>
      </Layout>
    )
  }
}

export default CaseIndex

export const blogIndexFragment = graphql`
  query CasePost($language: String!) {
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
        description
      }
    }
    allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        filter: { frontmatter: {
          language: { eq: $language }
          type: { eq: "project" }
        }}
      ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            date(formatString: "LL")
            title
            projectInfo
            image {
              childImageSharp {
                fluid(maxWidth: 420) {
                  ...GatsbyImageSharpFluid_noBase64
                }
              }
            }
          }
        }
      }
    }
  }
`
