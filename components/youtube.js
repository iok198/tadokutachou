import React from "react"
import YouTube from "react-youtube"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'

import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Overlay from 'react-bootstrap/Overlay'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from "react-bootstrap/Popover"
import Row from 'react-bootstrap/Row'

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
                {this.state.dictionaryData.length !== 0 ? <>
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
                </> : <FontAwesomeIcon spin icon={faCog} />}
            </Popover>
        )
        return (
            <>
                <OverlayTrigger trigger="click" placement="top" overlay={popover}>
                    <span onClick={this.getDefinition} ref={target}>{this.props.word}</span>
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
            subtitleLines: [],
			loadingCount: 0,
			height: 0
        }
    }

    onReady(e) {
        this.player = e.target
		this.setState({ height: this.player.clientHeight })
    }

    seekTo(item) {
        this.player.seekTo(item.sentenceBeginning)
    }

	isLoading() {
		return this.state.loadingCount !== 0
	}

	startLoading() {
		this.setState({ loadingCount: this.state.loadingCount + 1 })
	}

	endLoading() {
		this.setState({ loadingCount: this.state.loadingCount - 1 })
	}

    requestSubtitles() {
        const url = this.state.linkInput

		this.startLoading()
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
            for (const lineIndex in subtitleLines) {
                for (const wordIndex in subtitleLines[lineIndex].parsedData) {
                    subtitleLines[lineIndex].parsedData[wordIndex].index = index
                    index++
                }
            }
            this.setState({ subtitleLines })
			this.endLoading()
        })
        .then(err => console.error)
    }

    render() {
        const youtubeOptions = {
            height: '390',
            width: '640'
        }

        const { videoId, linkInput, subtitleLines } = this.state

        const subtitleLineElements = subtitleLines.map((line, i) => {
            const subtitleText = line.parsedData.map((p, j) => <DefinitionPopover key={j} word={p.dictionaryForm}/>)

            return (
                <div className="tt-subtitle-line px-2 py-2" key={i} onClick={() => this.seekTo(line)}>{subtitleText}</div>
            )
        })

        return (
			<Container>
                <h1>View Subtitles</h1>
				<Row>
					<Col>
						<InputGroup className="mb-3">
							<FormControl
								placeholder="Enter YouTube link"
								value={linkInput} onChange={(e) => this.setState({ linkInput: e.target.value })}
							/>
							<InputGroup.Append>
								<Button variant="outline-secondary" onClick={() => this.requestSubtitles()}>Load</Button>
							</InputGroup.Append>
						</InputGroup>
					</Col>
				</Row>
				<Row className="row-eq-height">
					<Col>
						<YouTube
							videoId={videoId}
							opts={youtubeOptions}
							onReady={(e) => this.onReady(e)}
						/>
					</Col>
					<Col className="overflow-auto tt-subtitle-view">
						{this.isLoading()
							? <div className="d-flex justify-content-center w-100" style={{ height: `${youtubeOptions.height}px` }}>
								<FontAwesomeIcon size="6x" spin icon={faCog} className="align-self-center" />
							</div>
							: subtitleLineElements.map((e, i) =>
								<>
									{i !== 0 && <hr className="mt-0 mb-0" />}
									{e}
								</>
							)
						}
					</Col>
				</Row>
			</Container>
        )
    }

}

export default ViewSubtitles
