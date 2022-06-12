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
import { run, State, newComp } from './utils.js';

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

    case 'SIZE':
      // consoleElement.value = '\nSIZE ' + +PARAMS[0];
      if (+PARAMS === 0) {
        canvasContainer.style.display = 'none';
        State.canvasHeight = 0;
        // canvasContainer.style.maxHeight = 250 + 'px';
        // canvasContainer.style.height = 250 + 'px';
      } else {
        canvasContainer.style.display = 'block';
      }
      window.dispatchEvent(new Event('resize'));

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
      execute({ value: 'SIZE 0' });
      break;
    case 'SHOW':
      // execute({ value: 'EMPTY' });
      // newComp();
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
