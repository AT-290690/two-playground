import { CodeMirror } from './libs/editor/two.editor.bundle.js';
import {
  canvasContainer,
  consoleElement,
  editorContainer,
  logoButton,
  mainContainer,
  compositionContainer,
  fullRunButton
} from './extentions/composition.js';
import { execute } from './commands/exec.js';
import { newComp, run, State } from './commands/utils.js';

logoButton.addEventListener('click', run);
fullRunButton.addEventListener('click', run);
export const editor = CodeMirror(editorContainer, {});
editor.changeFontSize('10px');
editor.setSize(
  mainContainer.getBoundingClientRect().width,
  mainContainer.getBoundingClientRect().height - 80
);
editorContainer.addEventListener(
  'click',
  () => (State.activeWindow = editorContainer)
);

const resize = e => {
  if (State.isFullScreen) {
    editor.setSize(
      mainContainer.getBoundingClientRect().width,
      State.canvasHeight
        ? e.target.innerHeight -
            State.canvasHeight / 2 -
            (State.canvasHeight - 59)
        : e.target.innerHeight - 62
    );
  } else {
    editor.setSize(
      mainContainer.getBoundingClientRect().width,
      mainContainer.getBoundingClientRect().height - 80
    );
  }
  canvasContainer.innerHTML = `<img src="./assets/images/404.svg" height="250" width="100%" />`;
};
window.addEventListener('resize', resize);

document.addEventListener('keydown', e => {
  const activeElement = document.activeElement;
  if (e.key.toLowerCase() === 's' && (e.ctrlKey || e.metaKey)) {
    e = e || window.event;
    e.preventDefault();
    e.stopPropagation();
    run();
  } else if (e.key === 'Enter') {
    if (activeElement === consoleElement) {
      execute(consoleElement);
    }
  } else if (e.key === 'Escape' && (e.ctrlKey || e.metaKey)) {
    if (activeElement === consoleElement) {
      editor.focus();
      State.activeWindow = editorContainer;
    } else if (State.activeWindow === editorContainer) {
      consoleElement.value = '';
      consoleElement.focus();
    }
  }
});
newComp().click();
editor.setValue(`const { draw, background, width, height } = Engine
render = Engine.render()
render.makeGrid(40)
// your code here

rect = render.makeRectangle(width(0.5), height(0.5), 30, 30)
rect.noFill()
rect.stroke = "orchid"
rect.linewidth = 4
rect.rotation = 0.8

render.update()
`);
execute({ value: 'FULL' });
setTimeout(async () => {
  document.body.removeChild(document.getElementById('splash-screen'));
}, 1000);
