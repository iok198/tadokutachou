const AdmZip = require('adm-zip')
const Fuse = require('fuse.js')
const fs = require('fs')
const https = require('https')
const path = require('path')
const zlib = require('zlib')

const dictionaryDirectory = path.join(__dirname, '..', 'temp', 'dictionaries')
const allDictionaries = [
	{
		fileName: 'daijirin.json',
		name: '三省堂　スーパー大辞林'
	},
	{
		fileName: 'daijisen.json',
		name: '大辞泉'
	}
].map(d => {
	return {
		...d,
		url: `https://munasawagi.github.io/${d.fileName}.zip`,
		path: path.join(dictionaryDirectory, d.fileName)
	}
})

function downloadToPath(url, path) {
	return new Promise((resolve, reject) => {
		https.get(url, response => {
		    const statusCode = response.statusCode

		    if (statusCode !== 200) {
		        return reject('Download error!')
		    }

		    const writeStream = fs.createWriteStream(path)
		    response.pipe(writeStream)

		    writeStream.on('error', (e) => reject(`Error writing to file: ${e}`))
		    writeStream.on('finish', () => writeStream.close(resolve))
		});
	})
}

async function setup() {
	await fs.promises.mkdir(dictionaryDirectory, { recursive: true })

	for (const dictionary of allDictionaries) {
		const dictionaryPath = path.join(dictionaryDirectory, dictionary.fileName)

		// Check if file exists already.
		const exists = await fs.promises.stat(dictionaryPath).catch(() => false)
		if (exists) {
			continue
		}

		// Download zip file.
		const zipPath = `${dictionaryPath}.zip`
		console.log(`dictionary: downloading ${dictionary.name} → ${zipPath}`)
		await downloadToPath(dictionary.url, zipPath)

		// Unzip single file archived in zip file.
		const zip = new AdmZip(zipPath)
		zip.extractEntryTo(dictionary.fileName, dictionaryDirectory, false, true)

		// Clean up zip file.
		await fs.promises.unlink(zipPath)
		console.log(`dictionary: finished extracting ${dictionary.name} → ${dictionaryPath}.`)
	}
}

class Dictionary {

	constructor() {
		this.dictionaries = allDictionaries.map(d => {
			return {
				...d,
	            data: require(d.path).map(x => {
					return {
						expression: x[0],
						reading: x[1],
						glossary: x[5]
					}
				})
	        }
		})
	}

	search(q) {
		const options = {
			shouldSort: true,
			threshold: 0.6,
			location: 0,
			distance: 20,
			maxPatternLength: 32,
			minMatchCharLength: 1,
			keys: ['expression']
		}

		return this.dictionaries.map(d => {
			const fuse = new Fuse(d.data, options)
			return {
				provider: d.provider,
				results: fuse.search(q).slice(0, 5)
			}
		})
	}

}

module.exports = {
	Dictionary,
    setup
}
