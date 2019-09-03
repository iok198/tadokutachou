import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

import Component from "./home"
import ViewSubtitles from "./youtube"

class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={Component} />
                    <Link to="/">Home</Link>
                    <Link to="/subtitles">Subtitles</Link>
                    <Route path="/subtitles" component={ViewSubtitles} />
                </div>
            </Router>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("app"))