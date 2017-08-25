import JSZip from 'jszip'
import fs from 'fs'
import sanitizeFilename from 'sanitize-filename'

export function createZipWithLocalFiles(filestoAdd, zipfilePath) {
    /*
    const zip = new AdmZip()

    filestoAdd.forEach(file => {
        zip.addFile(file.name, fs.readFileSync(file.path), '', '0644')
    })

    zip.writeZip(zipfilePath)
    */
    const zip = new JSZip()
    filestoAdd.forEach(file => {
        zip.file(sanitizeFilename(file.name), fs.readFileSync(file.path), 'utf-8')
    })

    return new Promise((resolve, reject) => {
        zip.generateNodeStream({type:'nodebuffer', streamFiles:true})
            .pipe(fs.createWriteStream(zipfilePath))
            .on('finish', () => resolve())
            .on('error', () => reject())
    })
}