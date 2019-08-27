function parseSRT(string) {
    return string.split(/\n{2,}/g)
		.slice(1, -1)
        .map(s => {
			let [timingsString, text] = s.split("\n")
			let timings = timingsString.split(" --> ")

			// Seek To Math
			
			let startTimeComponents = timings[0].split(":")
			let endTimeComponents = timings[1].split(":")
			let sentenceBeginning = (parseInt(startTimeComponents[0]) * 3600) + (parseInt(startTimeComponents[1]) * 60) + parseFloat(startTimeComponents[2])
			let sentenceEnd = (parseInt(endTimeComponents[0]) * 3600) + (parseInt(endTimeComponents[1]) * 60) + parseFloat(endTimeComponents[2]) 

			return {
				startTime: timings[0],
				endTime: timings[1],
				sentenceBeginning,
				sentenceEnd,
				text
			}
		})
}


module.exports = {
    parseSRT
}
