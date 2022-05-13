if (!document.getElementById) document.write('<link rel="stylesheet" type="text/css" href="./style.css">');
import { initView, drawGame, addSizeInputs } from "./gameOfLife/view.js";
import { Model } from "./gameOfLife/model.js";
import { controller } from "./gameOfLife/controller.js";

initView();
addSizeInputs();

const model = new Model();
model.addObserver(drawGame)


const events = {
    start : () => controller(model),
    stop : () => model.stop(),
    reset : () => model.reset(),
}

Object.entries(events).forEach(
    ([key, value]) =>
        document.querySelector(`#${key}`).addEventListener('click', value)
);

model.init();
drawGame(model);

// inputs
const heightInput = document.createElement("input");
const widthInput = document.createElement("input");

heightInput.type="number";
widthInput.type="number";

const valider = document.createElement("button");
valider.textContent = "Valider";
valider.addEventListener("click", () => {
    model = new Model(heightInput.value, widthInput.value)
    initView(heightInput.value, widthInput.value);
    drawGame();
});

const div = document.createElement("div");
div.id = "resize";

div.appendChild(heightInput);
div.appendChild(widthInput);
div.appendChild(valider);

document.body.appendChild(div);
