import {
  canvasContainer,
  compositionContainer,
  consoleElement,
  editorContainer,
  headerContainer,
  mainContainer,
  fullRunButton,
  printErrors,
  two
} from '../extentions/composition.js';
import { editor } from '../main.js';
import { run, State, createComposition, API, newComp } from './utils.js';

export const execute = async CONSOLE => {
  consoleElement.classList.remove('error_line');
  consoleElement.classList.add('info_line');

  const [CMD, ...PARAMS] = CONSOLE.value.trim().split('\n').pop().split(' ');
  switch (CMD?.trim()?.toUpperCase()) {
    case 'ENCODE':
      {
        const encoded = LZUTF8.compress(editor.getValue(), {
          outputEncoding: 'Base64'
        });
        editor.setValue(encoded);
        consoleElement.value = '';
      }
      break;
    case 'DECODE':
      {
        editor.setValue(
          LZUTF8.decompress(editor.getValue(), {
            inputEncoding: 'Base64',
            outputEncoding: 'String'
          })
        );
        consoleElement.value = '';
      }
      break;

    case 'EMPTY':
      if (State.lastComposition) {
        mainContainer.parentNode.replaceChild(
          State.lastComposition,
          mainContainer
        );
        State.lastComposition = null;
      }
      two.destroyComposition();
      compositionContainer.innerHTML = '';
      consoleElement.value = '';
      break;
    case 'CLEAR':
      {
        editor.setValue('');
        consoleElement.value = '';
      }
      break;
    case '>.':
      {
        const str = CONSOLE.value.split('>. ')[1];
        consoleElement.value = str
          .split('')
          .map((_, i) => str.charCodeAt(i))
          .join(';');
      }
      break;
    case '<.':
      {
        const str = CONSOLE.value.split('<. ')[1];
        consoleElement.value = String.fromCharCode(...str.split(';'));
      }
      break;
    case 'COMPRESS':
      editor.setValue(
        editor
          .getValue()
          .toString()
          .replace(/[ ]+(?=[^"]*(?:"[^"]*"[^"]*)*$)+|\n|\t|;;.+/g, '')
          .trim()
      );
      break;
    case 'RUN':
    case 'SAVE':
      run();
      consoleElement.value = '';
      break;
    case 'EXIT_FULLSCREEN':
    case 'EXIT':
      editorContainer.style.display = 'block';
      canvasContainer.style.display = 'block';
      canvasContainer.style.maxHeight = '250px';
      canvasContainer.style.height = '250px';
      fullRunButton.style.display = 'none';
      mainContainer.classList.remove('large');
      mainContainer.classList.add('small');
      headerContainer.style.display = 'block';
      editor.setSize(
        mainContainer.getBoundingClientRect().width,
        mainContainer.getBoundingClientRect().height - 40
      );
      consoleElement.value = '';
      State.isFullScreen = false;
      break;

    case 'FULLSCREEN':
    case 'FULL':
      {
        mainContainer.classList.remove('small');
        mainContainer.classList.add('large');
        headerContainer.style.display = 'none';
        fullRunButton.style.display = 'block';
        // const w = mainContainer.getBoundingClientRect().width;
        // const h = mainContainer.getBoundingClientRect().height / 2;
        // editor.setSize(w, h + 60);
        canvasContainer.style.maxHeight = 250 + 'px';
        canvasContainer.style.height = 250 + 'px';
        consoleElement.value = '';
        State.isFullScreen = true;
        window.dispatchEvent(new Event('resize'));
      }
      break;
    case 'SIZE':
      // consoleElement.value = '\nSIZE ' + +PARAMS[0];
      if (+PARAMS === 0) {
        canvasContainer.style.display = 'none';
        State.canvasHeight = 0;
        // canvasContainer.style.maxHeight = 250 + 'px';
        // canvasContainer.style.height = 250 + 'px';
        window.dispatchEvent(new Event('resize'));
      } else {
        canvasContainer.style.display = 'block';
        State.canvasHeight = 250;
      }
      // else {
      //   canvasContainer.style.display = 'block';
      //   canvasContainer.style.minHeight = +PARAMS[0] + 'px';
      //   editor.setSize(
      //     mainContainer.getBoundingClientRect().width,
      //     mainContainer.getBoundingClientRect().height - PARAMS[0] - 80
      //   );
      // }
      break;
    case 'BLANK':
    case 'NEW':
      execute({ value: 'EMPTY' });
      newComp();
    case 'FOCUS':
      // execute({ value: 'EMPTY' });
      // newComp();
      execute({ value: 'FULL' });
      execute({ value: 'SIZE 0' });
      break;
    case 'SHOW':
      // execute({ value: 'EMPTY' });
      // newComp();
      execute({ value: 'FULL' });
      execute({ value: 'SIZE 1' });
      window.dispatchEvent(new Event('resize'));

      break;
    case 'B':
    case 'BIG':
      consoleElement.style.height = window.innerHeight - 95 + 'px';
      consoleElement.value = '';
      break;
    case 'M':
    case 'MID':
      consoleElement.style.height = window.innerHeight / 2 - 40 + 'px';
      consoleElement.value = '';
      break;
    case 'S':
    case 'SMALL':
      consoleElement.style.height = '50px';
      consoleElement.value = '';
      break;

    default:
      printErrors(CMD + ' does not exist!');
      break;
  }
};
