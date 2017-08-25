import fs from 'fs'

export function exists(fileName) {
    try {
        return !!fs.statSync(fileName)
    } catch(err) {
        return false
    }
}