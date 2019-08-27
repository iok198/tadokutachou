function parseSRT(string) {
    return string.split(/\n{2,}/g)
        .slice(1)
        .map(s => {
			let [timingsString, text] = s.split("\n")
			let timings = timingsString.split(" --> ")
			return {
				startTime: timings[0],
				endTime: timings[1],
				text: text
			}
		})
}


module.exports = {
    parseSRT
}
