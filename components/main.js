import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import "bootstrap"
import "../styles/site.scss"

import Component from "./home"
import ViewSubtitles from "./youtube"

class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={Component} />
                    <Route path="/subtitles" component={ViewSubtitles} />

                    <Link to="/">Home</Link>
                    <Link to="/subtitles">Subtitles</Link>
                </div>
            </Router>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("app"))
