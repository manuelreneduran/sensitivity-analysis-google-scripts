/****************************   HTML FUNCTIONS  ******************************/

async function selectRange(button) {
  startButtonLoad(button)

  const ranges = await selectRangeServer()
  selectRangeOnSuccess(ranges)
  endButtonLoad(button, 'Select Range')
}

async function selectRangeOnSuccess(ranges) {
  if (ranges.length === 0) {
    return
  }
  appendIndependentRanges(ranges)
  return
}

function appendIndependentRanges(ranges) {
  const rangesDiv = document.getElementById('ind-var-ranges')
  const filteredRanges = removeDuplicateRanges(ranges, rangesDiv)
  const rangeElements = createIndRangeElement(filteredRanges, rangesDiv)
  rangeElements.forEach((e) => {
    rangesDiv.appendChild(e)
  })
  return
}

/**
 * Creates the interactive boxes that hold information on independent range values
 * @param {Array} ranges The filtered ranges of unique range values
 * @param {HTMLElement} rangesDiv The div with id 'ind-var-ranges' - container for ranges
 * @returns {Array} An array of HTML Elements
 */
function createIndRangeElement(ranges, rangesDiv) {
  let elements = []
  let lastChild = rangesDiv.children[rangesDiv.children.length - 1]
  let counter = 1

  if (lastChild) {
    counter = parseInt(lastChild.id.match(/[0-9]/gi).join('')) + 1
  }

  for (var i = 0; i < ranges.length; i++) {
    const range = ranges[i]

    // create and set parent node
    let rangeElement = document.createElement('li')
    rangeElement.id = `ind-var-ranges-item-${counter}`
    rangeElement.classList.add('ind-var-ranges-item')
    rangeElement.setAttribute(`data-range`, range.range)

    // create and set header child node
    let rangeElementHeader = document.createElement('div')
    rangeElementHeader.classList.add(`ind-var-ranges-header`)
    rangeElementHeader.innerHTML = `<div class="ind-var-ranges-header-notation">${range.range}</div>
                                    <div class="ind-var-ranges-header-value">${range.value}</div>`
    rangeElementHeader.id = `ind-var-ranges-header-value-${counter}`

    // create and set inputs child node
    let rangeElementInputs = document.createElement('div')
    rangeElementInputs.classList.add('ind-var-ranges-inputs')
    let rangeElementInput = createRangeElementsInput(1)
    let rangeElementAddValue = createRangeElementsAddValue()
    rangeElementInputs.appendChild(rangeElementInput)
    rangeElementInputs.appendChild(rangeElementAddValue)

    // create and set footer child node
    let rangeElementFooter = document.createElement('div')
    rangeElementFooter.classList.add('ind-var-ranges-footer')
    rangeElementFooter.innerHTML = `
                                      <div class="btn btn-outline-success save-button ind-var-footer-button" id="save-button-${counter}">
                                        Save
                                      </div>
                                      <div class="btn btn-outline-danger delete-button ind-var-footer-button" id="delete-button-${counter}">
                                        Delete
                                      </div>
                                   `
    rangeElement.appendChild(rangeElementHeader)
    rangeElement.appendChild(rangeElementInputs)
    rangeElement.appendChild(rangeElementFooter)
    elements.push(rangeElement)
    counter++
  }
  return elements
}

async function addIndValueInput(link) {
  let lastInputDiv = link.parentElement.previousElementSibling
  let counter = parseInt(lastInputDiv.getAttribute('data-value'))
  let parentInputDiv = lastInputDiv.parentElement

  let newInputDiv = createRangeElementsInput(counter + 1)
  parentInputDiv.insertBefore(newInputDiv, lastInputDiv.nextSibling)
}

function createRangeElementsInput(counter) {
  let inputGroup = document.createElement('div')
  inputGroup.classList.add('input-group', 'mb-1')
  inputGroup.innerHTML = ` <span class="input-group-text" id="basic-addon1">New Value ${counter}</span>
                      <input  type="text" class="form-control" 
                      placeholder="100.00" aria-label="New Value ${counter}" aria-describedby="basic-addon1">`
  inputGroup.setAttribute('data-value', counter)
  return inputGroup
}

function createRangeElementsAddValue() {
  let container = document.createElement('div')
  container.classList.add('ind-var-ranges-inputs-add', 'mb-1', 'flex-row-c-c')
  container.innerHTML = `<a class="add-ind-value" onclick="addIndValueInput(this)" href="#">Add another value</a>`
  return container
}

function onFailure() {
  console.log('Failure')
}
/****************************   JS FUNCTIONS  ******************************/

async function selectRangeServer() {
  // save ranges to state

  return [
    { range: 'A1', value: '.1' },
    { range: 'A2', value: '-2' },
    { range: 'A3', value: '1.43' },
  ]
}

/****************************   HELPER FUNCTIONS  ******************************/

/**
 * Prevents range values that have already been added from being added again
 * @param {Array} ranges an array of range values
 * @param {Bool} isIndRange tells the function what div to fetch
 * @returns {Array} a filtered array of ranges
 */
function removeDuplicateRanges(ranges, rangesDiv) {
  let children = rangesDiv.children
  let childRanges = []

  for (var child of children) {
    childRanges.push(child.getAttribute('data-range'))
  }
  return ranges.filter((r) => !childRanges.includes(r.range))
}

function startButtonLoad(button) {
  const spinner = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  Picking...`
  button.Child = spinner
  button.disabled = true
}

function endButtonLoad(button, text) {
  button.Child = text
  button.disabled = false
}

async function waitFor(ms) {
  return new Promise((res) => {
    setTimeout(() => {
      res()
    }, ms)
  })
}

function getFullNotationRange(range) {
  if (range.length === 2) {
    return range
  }
  const startLetter = range[0]
  const endLetter = range[3]
  const startNum = parseInt(range[1])
  const endNum = parseInt(range[4])

  const nums = getNumRange(startNum, endNum)
  const alpha = getAlphaRange(startLetter, endLetter)

  const flattenNotations = []

  for (var i = 0; i < nums.length; i++) {
    for (var q = 0; q < alpha.length; q++) {
      let notation = alpha[q] + nums[i]
      flattenNotations.push(notation)
    }
  }
  return flattenNotations
}

function getAlphaRange(start, end) {
  const alpha = []

  const startChar = start.charCodeAt()
  const endChar = end.charCodeAt()

  let counter = startChar

  for (var i = startChar; i <= endChar; i++) {
    alpha.push(String.fromCharCode(counter))
    counter++
  }

  return alpha
}

function getNumRange(start, end) {
  let counter = start
  let nums = []

  for (var i = start; i <= end; i++) {
    nums.push(counter)
    counter++
  }

  return nums
}
