import React, { Component } from 'react'

export default class About extends Component {
  render() {
    return (
      <div>
        <section className="colorlib-about" data-section="about">
        <div className="colorlib-narrow-content">
            <div className="row">
                <div className="col-md-12">
                    <div className="row row-bottom-padded-sm animate-box" data-animate-effect="fadeInLeft">
                    <div className="col-md-12">
                        <div className="about-desc">
                        <h2 className="colorlib-heading">Who Am I?</h2>
                        <p>I'm Arpith and if you love about reading technical blogs, you are at right place.</p>
                        <p>Being software developer I come across many interesting works and here I'm sharing my personal views about it.</p>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        </section>
        <section className="colorlib-about">
        <div className="colorlib-narrow-content">
            <div className="row">
                <div className="col-md-6 col-md-offset-3 col-md-pull-3 animate-box" data-animate-effect="fadeInLeft">
                    <h2 className="colorlib-heading">How can you reach me?</h2>
                    <div className="desc">
                        Email: arpithtechy@gmail.com
                        </div>
                </div>
            </div>
        </div>    
        </section>
      </div>
    )
  }
}