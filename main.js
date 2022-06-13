import { CodeMirror } from './libs/editor/two.editor.bundle.js';
import {
  canvasContainer,
  consoleElement,
  editorContainer,
  mainContainer,
  fullRunButton,
  consoleResizerElement,
  editorResizerElement,
  appButton,
  focusButton
  // plotButton
} from './extentions/composition.js';
import { execute } from './commands/exec.js';
import { newComp, resizer, run, State } from './commands/utils.js';

fullRunButton.addEventListener('click', run);
appButton.addEventListener('click', () => execute({ value: 'SHOW' }));
focusButton.addEventListener('click', () => execute({ value: 'FOCUS' }));
// plotButton.addEventListener('click', () => execute({ value: 'PLOT' }));
export const editor = CodeMirror(editorContainer, {});
editor.changeFontSize('15px');
editor.setSize(
  mainContainer.getBoundingClientRect().width,
  mainContainer.getBoundingClientRect().height - 70
);
editorContainer.addEventListener(
  'click',
  () => (State.activeWindow = editorContainer)
);
const resize = e => {
  editor.setSize(
    mainContainer.getBoundingClientRect().width,
    mainContainer.getBoundingClientRect().height - State.canvasHeight - 70
  );
  canvasContainer.innerHTML = `<img src="./assets/images/404.svg" height="250" width="100%" />`;
};
window.addEventListener('resize', resize);
if (!/Mobi|Android/i.test(navigator.userAgent)) {
  resizer(
    consoleResizerElement,
    e => {
      if (e.pageY > 5) {
        const height = mainContainer.getBoundingClientRect().height;
        // State.height = e.pageY;
        consoleResizerElement.style.bottom = height - e.pageY + 10 + 'px';
        consoleElement.style.top = e.pageY - 10 + 'px';
        consoleElement.style.height = height - e.pageY + 'px';

        // editor.setSize(
        //   mainContainer.getBoundingClientRect().width,
        //   State.height - State.canvasHeight - 10
        // );
      }
    },
    'row-resize'
  );

  resizer(
    editorResizerElement,
    e => {
      if (
        e.pageY > 5 &&
        e.pageY < mainContainer.getBoundingClientRect().height
      ) {
        State.canvasHeight = e.pageY;
        canvasContainer.style.height = e.pageY + 'px';
        editor.setSize(
          mainContainer.getBoundingClientRect().width,
          mainContainer.getBoundingClientRect().height - State.canvasHeight - 70
        );
      }
    },
    'row-resize'
  );
}
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
  }
});
newComp();
// editor.setValue(`const { width, height } =  Engine
// const render = Engine.render()
// render.makeGrid(40)
// // your code here
// let rect = render.makeRectangle(width(0.5), height(0.5), 30, 30)
// rect.noFill()
// rect.stroke = "orchid"
// rect.linewidth = 4
// rect.rotation = 0.8
// render.update()
// `);
execute({ value: 'SHOW' });
State.sceneHeight = 253;
State.height = window.innerHeight;
fullRunButton.style.display = 'block';
canvasContainer.style.height = 253 + 'px';
consoleElement.value = '';
window.dispatchEvent(new Event('resize'));
