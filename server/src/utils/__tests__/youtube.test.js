import { saveMp3FromVideos } from '../youtube'
import { MP3_OUTPUT_PATH } from '../../config'

import fs from 'fs'
test('it should save a mp3 in the correct folder', async () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000000
  await saveMp3FromVideos(['otqcKT1pwqs', '4IP_E7efGWE'])

  const file1 = `${MP3_OUTPUT_PATH}/otqcKT1pwqs`;
  const file2 = `${MP3_OUTPUT_PATH}/4IP_E7efGWE`;
  
  expect(fs.statSync(file1)).toBeDefined()
  expect(fs.statSync(file2)).toBeDefined()
})
