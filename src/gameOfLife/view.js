import { GAME_SIZE, CELL_SIZE } from "./constants.js";

let canvas = document.createElement("canvas");
let context = canvas.getContext("2d");

const drawCell = (x, y, value) => {
  context.fillStyle = value;
  context.fillRect(x + CELL_SIZE * x, y + CELL_SIZE * y, CELL_SIZE, CELL_SIZE);
};

export const initView = (height = GAME_SIZE, width = GAME_SIZE, first = true) => {
  height ||= GAME_SIZE;
  width ||= GAME_SIZE;

  if (first) {
    document.getElementById("game").appendChild(canvas);
  }
  else {
    const c2 = canvas.cloneNode();
    canvas.parentNode.replaceChild(c2, canvas);
    canvas = c2;
    context = canvas.getContext("2d");
  }


  canvas.setAttribute("height", height * CELL_SIZE + height - 1);
  canvas.setAttribute("width", width * CELL_SIZE + width - 1);
};

export const addClickEventListener = onClick => {
  canvas.addEventListener("click", event => {
    const [x, y] = [event.offsetX, event.offsetY].map(c => (c - c % CELL_SIZE) / CELL_SIZE);
    onClick(x, y);
  }, false)
}

export const drawGame = model => {
  model.state.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      drawCell(columnIndex, rowIndex, value);
    });
  });
};

export const addInputs = onValidate => {
  // inputs
  const heightInput = document.createElement("input");
  const widthInput = document.createElement("input");

  heightInput.type = "number";
  widthInput.type = "number";

  heightInput.placeholder = "height";
  widthInput.placeholder = "width";

  const valider = document.createElement("button");
  valider.textContent = "Valider";
  valider.addEventListener("click", () => {
    let [height, width] = [heightInput, widthInput].map(input => input.valueAsNumber);
    onValidate(height, width);
  });

  const div = document.createElement("div");
  div.id = "resize";

  div.appendChild(heightInput);
  div.appendChild(widthInput);
  div.appendChild(valider);

  document.body.appendChild(div);
}

