import React from "react"
import YouTube from "react-youtube"

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
        let data = {
            url: this.state.linkInput
        }

        this.player.loadVideoById(data.url.split('=')[1])
        fetch("/api/subtitles", {
            method: "POST",
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify(data),
        })
        .then(data => data.json())
        .then(subtitleLines => {
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

        const displayedLines = subtitleLines.map(line => {
            const subtitleText = line.parsedData.map(p => p.original).join("|")
            return (
                <li onClick={() => this.seekTo(line)}>{subtitleText}</li>
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