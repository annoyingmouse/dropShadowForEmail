class Helpers {
  static createElement(element) {
    return document.createElement(element)
  }
  static setText (element, text) {
    return element.appendChild(document.createTextNode(text))
  }
  static createAndPopulate(element, text = null, attributes = null, styles = null) {
    const el = this.createElement(element)
    text && Helpers.setText(el, text)
    attributes && Helpers.setAttributes(el, attributes)
    styles && Helpers.setStyles(el, styles)
    return el
  }
  static setAttributes(element, attributes) {
    for (const attr in attributes) {
      if(attributes.hasOwnProperty(attr)) {
        // converts camelCase to hyphen-separated, lowercase, string
        // e.g. "dataId" becomes "data-id"
        const attribute = attr.split(/(?=[A-Z])/).join('-').toLowerCase()
        element.setAttribute(attribute, attributes[attr])
      }
    }
  }
  static setStyles(element, declarations) {
    for (const prop in declarations) {
      if(declarations.hasOwnProperty(prop)){
        const property = prop.split(/(?=[A-Z])/).join('-').toLowerCase()
        element.style[property] = declarations[prop]
      }
    }
  }
  static removeElements(elms) {
    elms.forEach(el => el.remove())
  }
}

class Row {
  constructor(main, arr){
    this.main = main
    this.arr = arr
  }
}

const chunk = (arr, size) => Array.from({length:Math.ceil(arr.length/size)},(v,i) => arr.slice(i*size, i*size+size))

const build = (id) => {
  const canvas = document.getElementById('trimmed')
  const context = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  const half = width / 2
  const rows = []

  for(let i = 0; i < height; i++){
    const row = []
    const data = chunk(context.getImageData(0, i, half, 1).data, 4)
    data.forEach(cell => {
      const colour = Array.from(cell).slice(0, 3).map(num => Number(num).toString(16).padStart(2, '0')).join('')
      if(!row.length){
        row.push({
          incidence:1,
          colour:colour
        })
      }else{
        if(row[row.length - 1].colour === colour){
          row[row.length - 1].incidence++
        }else{
          row.push({
            incidence:1,
            colour:colour
          })
        }
      }
    })
    if(!rows.length){
      rows.push(new Row(false, row))
    }else{
      if(JSON.stringify(rows[rows.length - 1].arr) === JSON.stringify(row)) {
        rows[rows.length - 1].main = true
      }else{
        rows.push(new Row(false, row))
      }
    }
  }

  rows.forEach(Row => {
    const row = [...Row.arr]
    let target = document.getElementById('table')
    const tr = document.createElement('tr')
    if(Row.main){
      tr.dataset.main = 'true'
    }
    target.appendChild(tr)
    target = tr
    const td = Helpers.createAndPopulate('td', null, {
      align: 'center'
    }, {
      paddingLeft: `${row[0].incidence}px`,
      paddingRight:`${row[0].incidence}px`,
    })
    target.appendChild(td)
    target = td
    row.shift()
    row.forEach((part, i, arr) => {
      const div = Helpers.createAndPopulate('div', null, null, {
        display:'block',
        paddingLeft:'0px',
        paddingRight:'0px',
        backgroundColor:`#${part.colour}`,
        width: '100% !important',
        minWidth: 'initial !important',
        height:'1px',
        lineHeight:'1px',
        fontSize:'1px'
      })
      if (i !== arr.length - 1){
        Helpers.setStyles(div, {
          paddingLeft: `${part.incidence}px`,
          paddingRight:`${part.incidence}px`,
        })
      }
      target.appendChild(div)
      target = div
    })
  })
}

const trim = () => {
  const original_canvas = document.getElementById('original')
  const original_context = original_canvas.getContext('2d')
  const x = JSON.parse(original_canvas.dataset.x)
  const y = JSON.parse(original_canvas.dataset.y)
  const canvas = Helpers.createAndPopulate('canvas', null, {
    id: 'trimmed',
    width: x.width,
    height: y.height
  })
  const context = canvas.getContext('2d')
  const imgData = original_context.getImageData(x.start, y.start, x.width, y.height)
  context.putImageData(imgData, 0, 0)
  document.getElementById('trimmed_holder').appendChild(canvas)
  build()
}

const getDimension = (canvas, context, direction) => {
  const obj = {}
  const counter = direction === 'x'
    ? canvas.width
    : canvas.height
  for(let i = 0; i < counter; i++){
    const data = direction === 'x'
      ? context.getImageData(i, 0, 1, canvas.height).data
      : context.getImageData(0, i, canvas.width, 1).data
    const hasValue = data.some(e => e !== 255)
    if(hasValue && !obj.start){
      obj.start = i
    }
    if(!hasValue && obj.start && !obj.end){
      if(direction === 'x'){
        obj.end = i
        obj.width = i - obj.start
      }else{
        obj.end = i
        obj.height = i - obj.start
      }
    }
  }
  return obj
}

(() => {
  domtoimage.toPng(document.querySelector('.holder')).then(dataUrl => {
    const img = new Image()
    img.src = dataUrl
    img.onload = () => {
      const canvas = Helpers.createAndPopulate('canvas', null, {
        id: 'original',
        width: img.width,
        height: img.height
      })
      document.getElementById('original_holder').appendChild(canvas)
      const context = canvas.getContext('2d')
      context.fillStyle = "white"
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(img, 0, 0);
      canvas.dataset.x = JSON.stringify(getDimension(canvas, context, 'x'))
      canvas.dataset.y = JSON.stringify(getDimension(canvas, context, 'y'))
      trim()
    }
  }).catch(function (error) {
    console.error('oops, something went wrong!', error);
  })
})()