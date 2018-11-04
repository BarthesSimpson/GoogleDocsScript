const {
  getArgsFromTestCase,
  getFunctionFromText
} = require('./google_docs_debugger')

describe('Test case regex tests', () => {
  it('Gets integer args for a test case', () => {
    const testCase = '@test: {input: 5, output: 10} @endTest'
    expect(getArgsFromTestCase(testCase)).toEqual({ input: 5, output: 10 })
  })

  it('Gets string args for a test case', () => {
    const testCase = '@test: {input: "abcdefg", output: "hijklmnop"} @endTest'
    expect(getArgsFromTestCase(testCase)).toEqual({
      input: 'abcdefg',
      output: 'hijklmnop'
    })
  })

  it('Gets integer array args for a test case', () => {
    const testCase = '@test: {input: [5, 6], output: [7, 10]} @endTest'
    expect(getArgsFromTestCase(testCase)).toEqual({
      input: [5, 6],
      output: [7, 10]
    })
  })
})

describe('Function regex tests', () => {
  it('Gets a function', () => {
    const testCase = '@func: function({string}){console.log(string)} @endFunc'
    expect(getFunctionFromText(testCase)).toEqual(
      'function({string}){console.log(string)}'
    )
  })
  it('Gets an anonymous function', () => {
    const testCase = '@func: (input) => "hijklmnop" @endFunc'
    expect(getFunctionFromText(testCase)).toEqual('(input) => "hijklmnop"')
  })
  it('Gets a multiline function', () => {
    const testCase = `@func: (input) => {
      console.log("hijklmnop");
      return "hijklmnop";
    } @endFunc`
    expect(getFunctionFromText(testCase)).toEqual(`(input) => {
      console.log("hijklmnop");
      return "hijklmnop";
    }`)
  })
})
