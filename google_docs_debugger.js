const FUNCTION_REGEX = /@func:([\s\S]*)@endFunc/g
const TEST_REGEX = /@test:(.*)@endTest/g

function printIfTestCase(node) {
  const text = node.innerText
  const testCase = getArgsFromTestCase(text)
  return testCase
}

function printIfFunction(node) {
  const text = node.innerText
  const func = getFunctionFromText(text)
  return func
}

function getFunctionFromText(text) {
  FUNCTION_REGEX.lastIndex = 0
  const match = FUNCTION_REGEX.exec(text)
  return match ? match[1].trim() : 0
}

function getArgsFromTestCase(text) {
  TEST_REGEX.lastIndex = 0
  const match = TEST_REGEX.exec(text)
  return match
    ? JSON.parse(
        match[1]
          .trim()
          .replace('input', '"input"')
          .replace('output', '"output"')
      )
    : 0
}

// Gather the function and test cases
function constructTests() {
  const textNodes = Array.from(
    document.getElementsByClassName('kix-wordhtmlgenerator-word-node')
  )
  let func
  const testCases = []
  textNodes.forEach(node => {
    const testCase = printIfTestCase(node)
    if (testCase) testCases.push(testCase)

    let _func = printIfFunction(node)
    if (_func) func = eval(_func)
  })
  return { func, testCases }
}

function runTests() {
  let outputContainer = makeOutputContainer()
  const { func, testCases } = constructTests()
  if (!func) {
    outputContainer = writeLine(outputContainer, 'No function found')
  } else {
    testCases.forEach(({ input, output }, i) => {
      const res = func.apply(input)
      const line =
        res === output
          ? `Test ${i}: ${input} ✓`
          : `Test ${i}: ${input} ✗ received: ${JSON.stringify(
              res
            )} but expected ${JSON.stringify(output)}`
      outputContainer = writeLine(outputContainer, line)
    })
  }

  writeOutputToDOM(outputContainer)
}

function makeOutputContainer() {
  return `<@start><@end>`
}

function writeLine(container, line) {
  const lineDiv = `<div style="padding: 0.5em 1em;">${line}</div>`
  return container.replace('<@end>', `${lineDiv}<@end>`)
}

function writeOutputToDOM(container) {
  const html = container
    .replace('<@start>', '<div>')
    .replace('<@end>', '</div>')
  const testResults = document.querySelector('div.test-results')
  testResults.innerHTML = html
}

function addTestRunner() {
  let testResultsDiv = document.createElement('div')
  testResultsDiv.classList = 'test-results'

  let button = document.createElement('button')
  button.innerHTML = 'Run Tests'
  button.addEventListener('click', runTests)
  const header = document.querySelector('div.kix-page-header')
  header.appendChild(button)
  header.appendChild(testResultsDiv)
}

function addPythonConsole() {
  let iframe = document.createElement('iframe')
  iframe.style = 'border: none; width: 100%; height: 280px'
  iframe.src = 'https://console.python.org/python-dot-org-console/'
  const page = document.querySelector('div.kix-page-column')
  page.appendChild(iframe)
}

addTestRunner()
// addPythonConsole()

module.exports = {
  getArgsFromTestCase,
  getFunctionFromText
}
