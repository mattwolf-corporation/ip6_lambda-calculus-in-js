export {getElement, getElements, onInputListener, onInputListeners, toHexString, toRGBString}


// const getMaybeElement = id => {
//     const element = getElement(id)
//     element
//         ? Right(maybe(true)(element))
//         : Left(maybe(false)("Error: No element"))
// }

const getElement = id => document.getElementById(id); // maybe impl for safety
const getElements = (...id) => id.map(e => getElement(e))

const onInputListener = (observable, input) => input.oninput = _ => observable = observable(setValue)(input.value) // maybe impl for safety
const onInputListeners = (observable, ...inputs) => inputs.map(input => onInputListener(observable, input))


const toRGBString = (r, g, b) => 'rgb(' + r + ',' + g + ',' + b + ')'
const toHexString = (r, g, b) => "#" + toHex(r) + toHex(g) + toHex(b)
const toHex = n => {
    if (n === undefined) n = 0
    let hex = Math.round(n).toString(16)
    return hex.length === 1 ? "0" + hex : hex
}