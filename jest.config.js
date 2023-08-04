/** @type {import('ts-jest').JestConfigWithTsJest} */
const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      path.join(__dirname, '/__mocks__/fileMock.ts'),
    '\\.(scss|css)$': path.join(__dirname, '/__mocks__/styleMock.ts')
  },
};
