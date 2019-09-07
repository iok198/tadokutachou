import React from "react"
import YouTube from "react-youtube"

import Overlay from 'react-bootstrap/Overlay'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from "react-bootstrap/Popover"

class DefinitionPopover extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false,
            dictionaryData: []
        }

        this.getDefinition = this.getDefinition.bind(this)
    }

    getDefinition() {
        const word = this.props.word
        console.log("I WAS CALLED!!!")
        fetch(`/api/dictionary/${word}`, {
            method: "GET",
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrer: 'no-referrer'
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            this.setState({ 
                show: true,
                dictionaryData: data
            })
        })
    }

    render() {
        const target = React.createRef()
        const popover = (
            <Popover>
                {this.state.dictionaryData.length !== 0 && <>
                    <Popover.Title as="h3">{this.state.dictionaryData[0].results[0].expression}</Popover.Title>
                    <Popover.Content>
                    {this.state.dictionaryData.map((entry, i) => {
                        return (
                            <div key={i}>
                                <p>{entry.results[0].glossary}</p>
                            </div>
                        )
                    })}
                    </Popover.Content>
                </>}
            </Popover>
        )
        return (
            <>
                <OverlayTrigger trigger="click" placement="top" overlay={popover}>
                    <button onClick={this.getDefinition} ref={target}>{this.props.word}</button>
                </OverlayTrigger>
                {/* <Overlay show={this.state.show} target={target.current} placement="auto">
                    <div>
                        {this.state.dictionaryData.map((entry, i) => {
                            return (
                                <div key={i}>
                                    <h4>{entry.provider}</h4>
                                    <h3>{entry.results[0].expression}</h3>
                                    <p>{entry.results[0].glossary}</p>
                                </div>
                            )
                        })}
                    </div>
                </Overlay> */}
            </>
        )
    }
}

class ViewSubtitles extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            videoId: "WUbSwb43Pek",
            linkInput: "https://www.youtube.com/watch?v=WUbSwb43Pek",
            subtitleLines: []
        }
    }

    _onReady(e) {
        this.player = e.target
    }

    seekTo(item) {
        let sentenceBeginning = item.sentenceBeginning
        this.player.seekTo(sentenceBeginning)
    }

    requestSubtitles() {
        const url = this.state.linkInput

        this.player.loadVideoById(url.split('=')[1])
        fetch(`/api/subtitles/${encodeURIComponent(url)}`, {
            method: "GET",
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrer: 'no-referrer'
        })
        .then(data => data.json())
        .then(subtitleLines => {
            let index = 0
            for(const lineIndex in subtitleLines) {
                for(const wordIndex in subtitleLines[lineIndex].parsedData) {
                    subtitleLines[lineIndex].parsedData[wordIndex].index = index
                    index++
                }
            }
            this.setState({ subtitleLines })
        })
        .then(err => console.error)
    }

    render() {
        const youtubeOptions = {
            height: '390',
            width: '640',
        }

        const { videoId, linkInput, subtitleLines } = this.state

        const displayedLines = subtitleLines.map((line, i) => {
            const subtitleText = line.parsedData.map(p => <DefinitionPopover word={p.dictionaryForm}/>)

            return (
                <div onClick={() => this.seekTo(line)}>{subtitleText}</div>
            )
        })
        
        return (
            <div>
                <h1>Find Subtitles</h1>
                <YouTube 
                    videoId={videoId}
                    opts={youtubeOptions}
                    onReady={(e) => this._onReady(e)}/>

                <input type="text" id="subtitle" value={linkInput} onChange={(e) => this.setState({ linkInput: e.target.value })}/>
                <button onClick={() => this.requestSubtitles()}>Submit</button>
                
                <ol>
                    {displayedLines}
                </ol>
            </div>
            
        )
    }
}

export default ViewSubtitles