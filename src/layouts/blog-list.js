import React from "react"
import { graphql } from "gatsby"
import { Row, Cell } from "griding"

import { Container } from "../components/grid"
import Layout from "../components/layout"
import Pagination from "../components/pagination"
import Featured from "../components/featured"
import renderList from "../components/renderList"
import Navbar from "../components/Navbar/Navbar"

const BlogPostList = ({ data, pageContext }) => {
  const { allMarkdownRemark } = data
  const { currentPage, numPages } = pageContext

  return (
    <Layout>

      <Container>
        <Row>{allMarkdownRemark.edges.map(renderList)}</Row>

        <Pagination currentPage={currentPage} numPages={numPages} />
      </Container>
    </Layout>
  )
}

export default BlogPostList

export const query = graphql`
  query blogPostsList($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { featured: { eq: false } } }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date
            author
            category
            
          }
        }
      }
    }
  }
`
