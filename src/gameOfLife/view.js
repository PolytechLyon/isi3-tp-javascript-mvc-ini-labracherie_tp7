import { GAME_SIZE, CELL_SIZE } from "./constants.js";

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

const drawCell = (x, y, value) => {
  context.fillStyle = value;
  context.fillRect(x + CELL_SIZE * x, y + CELL_SIZE * y, CELL_SIZE, CELL_SIZE);
};

export const initView = (height = GAME_SIZE, width = GAME_SIZE, first = true) => {
  if (first) document.getElementById("game").appendChild(canvas);
  canvas.setAttribute("height", height * CELL_SIZE + height - 1);
  canvas.setAttribute("width", width * CELL_SIZE + width - 1);
};

export const drawGame = model => {
  model.state.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      drawCell(rowIndex, columnIndex, value);
    });
  });
};

