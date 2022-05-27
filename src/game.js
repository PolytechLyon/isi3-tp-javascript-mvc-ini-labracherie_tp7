if (!document.getElementById) document.write('<link rel="stylesheet" type="text/css" href="./style.css">');
import { initView, drawGame, addInputs, addClickEventListener } from "./gameOfLife/view.js";
import { Model } from "./gameOfLife/model.js";
import { controller } from "./gameOfLife/controller.js";

initView();

let model = new Model();
model.addObserver(drawGame);

// click
addClickEventListener(model.toggleState.bind(model));


const events = {
    start: () => controller(model),
    stop: () => model.stop(),
    reset: () => model.reset(),
}

Object.entries(events).forEach(
    ([key, value]) =>
        document.querySelector(`#${key}`).addEventListener('click', value)
);

model.init();
drawGame(model);

// Resize
addInputs((height, width) => {
    model = new Model(width, height)
    initView(height, width, false);
    model.addObserver(drawGame);
    model.init();
    drawGame(model);
    addClickEventListener(model.toggleState.bind(model));
});
