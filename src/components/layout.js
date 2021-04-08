/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { graphql } from "gatsby"

import Typography from "typography"
import moragaTheme from "typography-theme-moraga"
import { Provider as GridProvider } from "griding"
import { useStaticQuery } from "gatsby"

import Navbar from "./Navbar/Navbar"

const typography = new Typography(moragaTheme)
typography.injectStyles()

const Layout = ({ children }) => {   
    return (
        <GridProvider>
        <>
        <Navbar />    
        <main>{children}</main>
        </>
        </GridProvider>
    )
    }
Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
