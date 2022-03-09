let table = document.getElementById("table")

let currentBlock = 0
let blockColors = {
	0: "#ff0000"
}

let changeSelectedBlock = (elemt) => {
	currentBlock = elemt.value
	document.getElementById('blockColor').value = blockColors[elemt.value] ? blockColors[elemt.value] : setBlockColor(hslToHex(36 * (elemt.value % 10), 100, 50))
}

let setBlockColor = (color) => {
	var blockIndex = document.getElementById('blockIndex').value
	blockColors[blockIndex] = color
	document.querySelectorAll(".block" + blockIndex).forEach(e => {
		e.style.background = color
    e.style.color = invertColor(blockColors[currentBlock])
	})

  return color
}

let ontableclick = (elemt) => {
	if (elemt.className == "block" + currentBlock) {
		elemt.innerText = ""
		elemt.className = ""
		elemt.style.background = "transparent"
    elemt.style.color = ""
	} else {
		elemt.innerText = currentBlock
		elemt.className = "block" + currentBlock
		elemt.style.background = blockColors[currentBlock]
    elemt.style.color = invertColor(blockColors[currentBlock])
	}
}

let generateLevel = () => {
	var output = []
	var blockCount = 0
	while (document.querySelector(".block" + blockCount)) {
		var newBlock = {
			coords: [],
		}
		newBlock.color = blockColors[blockCount]
		
		document.querySelectorAll(".block" + blockCount).forEach(e => {
			newBlock.coords.push([parseInt(e.getAttribute("xcoord")), parseInt(e.getAttribute("ycoord"))])
		})
		
		output.push(newBlock)
		blockCount += 1
	}
	console.log(output)
	document.getElementById('levelOuput').value = JSON.stringify(output)
}

// Generate grid
for (let y = 0; y < 16; y++) { 
	let newRow = document.createElement("tr")
	for (let x = 0; x < 16; x++) { 
		let newData = document.createElement("td")
		newData.coord = "[" + (x - 7) + ", " + y + "]"
		newData.setAttribute("xcoord",  (x - 7))
		newData.setAttribute("ycoord",  y)
		newData.setAttribute("onclick", "ontableclick(this)")
		newRow.appendChild(newData)
	}
	table.prepend(newRow)
}


// from https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// from https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color
function invertColor(hex) {
  if (hex.indexOf('#') === 0) {
      hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
      throw new Error('Invalid HEX color.');
  }
  // invert color components
  var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
      g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
      b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
  // pad each with zeros and return
  return '#' + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}