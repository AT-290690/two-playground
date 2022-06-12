import { editor } from '../main.js';
import {
  consoleElement,
  editorContainer,
  print,
  compositionContainer,
  mainContainer,
  canvasContainer,
  alertIcon,
  errorIcon
} from '../extentions/composition.js';

export const API = 'http://localhost:8077';
// export const API = 'https://hyper-light.herokuapp.com';

export const State = {
  lastSelection: '',
  activeWindow: null,
  comments: null,
  lastComposition: null,
  isLogged: false,
  canvasHeight: 253,
  isHelpOpen: false,
  sceneHeight: 250,
  height: window.innerHeight - 62
};

export const droneIntel = icon => {
  icon.style.visibility = 'visible';
  setTimeout(() => {
    icon.style.visibility = 'hidden';
  }, 500);
};

// ${
//   params
//     ? params
//         .map(([key, val]) => ':=($' + key + ';' + val + ')')
//         .join(';') + ';'
//     : ''
// }
//cell({ ...std })(`=>()`);

export const resizer = (resizer, mousemove, cursor) => {
  resizer.style.cursor = cursor;
  resizer.mousemove = mousemove;

  resizer.onmousedown = function (e) {
    document.documentElement.addEventListener(
      'mousemove',
      resizer.doDrag,
      false
    );
    document.documentElement.addEventListener(
      'mouseup',
      resizer.stopDrag,
      false
    );
  };

  resizer.doDrag = e => {
    if (e.which != 1) {
      resizer.stopDrag(e);
      return;
    }
    resizer.mousemove(e);
  };

  resizer.stopDrag = e => {
    document.documentElement.removeEventListener(
      'mousemove',
      resizer.doDrag,
      false
    );
    document.documentElement.removeEventListener(
      'mouseup',
      resizer.stopDrag,
      false
    );
  };
};

export const exe = (source, params) => {
  let lastLine = editor.getLine(editor.lineCount() - 1)?.trim();
  if (
    lastLine &&
    !lastLine.includes('return') &&
    !lastLine.includes('const') &&
    !lastLine.includes('let') &&
    !lastLine.includes('var') &&
    !lastLine.includes('class') &&
    !lastLine.includes('function')
  ) {
    source =
      source.substring(0, source.length - lastLine.length) +
      ';return ' +
      lastLine;
  }
  // if (res !== undefined && i === tree.args.length - 1) {
  //   return ';return ' + res.toString().trimStart();
  // } else {
  //   return res;
  // }
  try {
    const result = new Function(`${source}`)();
    droneIntel(alertIcon);
    return result;
  } catch (err) {
    droneIntel(errorIcon);
    canvasContainer.style.background = 'var(--background-primary)';
    consoleElement.classList.remove('info_line');
    consoleElement.classList.add('error_line');
    consoleElement.value = consoleElement.value.trim() || err + ' ';
  }
};

// export const addSpace = str => str + '\n';
// export const printSelection = (selection, cursor, size) => {
//   const updatedSelection =
//     selection[selection.length - 1] === ';'
//       ? `Engine.print(${selection});`
//       : `Engine.print(${selection})`;
//   if (cursor + updatedSelection.length < size) {
//     editor.replaceSelection(updatedSelection);
//     exe(editor.getValue(), null);
//     const head = cursor;
//     const tail = cursor + updatedSelection.length;
//     editor.setSelection(head, tail);
//     editor.replaceSelection(selection);
//   }
// };
// export const stashComments = str => {
//   State.comments = str.match(/;;.+/g);
//   return str.replace(/;;.+/g, '##');
// };

// export const prettier = str => addSpace(str);
// .replace(/[ ]+(?=[^"]*(?:"[^"]*"[^"]*)*$)+/g, ' ')
// .split(';')
// .join('; ')
// .split('(')
// .join(' (');

export const run = () => {
  consoleElement.classList.add('info_line');
  consoleElement.classList.remove('error_line');
  consoleElement.value = '';
  // const cursor = editor.getCursor();
  // const selection = editor.getSelection();
  const source = editor.getValue().trim();
  // const formatted = prettier(source);
  // if (selection.trim()) {
  //   printSelection(selection.trim(), cursor, source.length);
  //   editor.setValue(formatted);
  // } else {
  print(exe(source, null));
  // }
  // if (cursor < formatted.length) editor.setCursor(cursor);
};

// export const fromBase64 = (str, params) => {
//   decode(
//     LZUTF8.decompress(str, {
//       inputEncoding: 'Base64',
//       outputEncoding: 'String'
//     }).trim(),
//     source => {
//       exe(source, params);
//     }
//   );
// };
// export const fromCompressed = (str, params) => {
//   decode(str, source => {
//     exe(source, params);
//   });
// };
// export const fromCode = (str, params) => {
//   decode(str, source => {
//     exe(source, params);
//   });
// };

export const newComp = (userId = 'Unknown user') => {
  const comp = document.createElement('div');
  comp.classList.add('composition');
  compositionContainer.appendChild(comp);
  return comp;
};
