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
  activeWindow: editorContainer,
  comments: null,
  lastComposition: null,
  isLogged: false,
  isFullScreen: false,
  canvasHeight: 250,
  isHelpOpen: false
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
export const exe = (source, params) => {
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

export const addSpace = str => str + '\n';
export const printSelection = (selection, cursor, size) => {
  const updatedSelection =
    selection[selection.length - 1] === ';'
      ? `Engine.print(${selection});`
      : `Engine.print(${selection})`;
  if (cursor + updatedSelection.length < size) {
    editor.replaceSelection(updatedSelection);
    exe(editor.getValue(), null);
    const head = cursor;
    const tail = cursor + updatedSelection.length;
    editor.setSelection(head, tail);
    editor.replaceSelection(selection);
  }
};
// export const stashComments = str => {
//   State.comments = str.match(/;;.+/g);
//   return str.replace(/;;.+/g, '##');
// };

export const prettier = str => addSpace(str);
// .replace(/[ ]+(?=[^"]*(?:"[^"]*"[^"]*)*$)+/g, ' ')
// .split(';')
// .join('; ')
// .split('(')
// .join(' (');

export const run = () => {
  consoleElement.classList.add('info_line');
  consoleElement.classList.remove('error_line');
  consoleElement.value = '';
  const cursor = editor.getCursor();
  const selection = editor.getSelection();
  const source = editor.getValue().trim();
  const formatted = prettier(source);
  if (selection.trim()) {
    printSelection(selection.trim(), cursor, source.length);
    editor.setValue(formatted);
  } else {
    print(exe(source, null));
    if (formatted !== source) {
      editor.setValue(formatted);
    }
  }
  if (cursor < formatted.length) editor.setCursor(cursor);
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

const editCompositionEvent = (element, data) => {
  if (State.lastComposition) {
    mainContainer.parentNode.replaceChild(State.lastComposition, mainContainer);
  }
  // if (data) {
  //   const decoded = LZUTF8.decompress(data, {
  //     inputEncoding: 'Base64',
  //     outputEncoding: 'String'
  //   });
  //   editor.setValue(decoded);
  // }
  State.lastComposition = element;
  element.parentNode.replaceChild(mainContainer, element);
  mainContainer.style.display = 'block';
  editor.setSize(
    mainContainer.getBoundingClientRect().width,
    mainContainer.getBoundingClientRect().height - 40
  );
  mainContainer.style.marginBottom =
    mainContainer.getBoundingClientRect().height + 'px';
};

export const createComposition = (userId, initial) => {
  if (userId) {
    const comp = document.createElement('div');
    comp.classList.add('composition');
    comp.setAttribute('userId', userId);
    comp.addEventListener('click', e => {
      editor.setValue('');
      canvasContainer.innerHTML = `<img src="./assets/images/404.svg" height="250" width="100%" />`;
      canvasContainer.style.background = 'var(--background-primary)';
      editor.setValue('');
      canvasContainer.innerHTML = `<img  src="./assets/images/404.svg" height="250" width="100%" />`;
      editCompositionEvent(comp);
      consoleElement.style.height = '50px';
    });

    const label = document.createElement('p');
    label.classList.add('label');
    compositionContainer.appendChild(label);
    if (initial) {
      label.textContent += initial.name + ' by ' + userId;
      comp.setAttribute('name', initial.name);
      comp.innerHTML = `<img class="thumbnail" src="${LZUTF8.decompress(
        initial.output,
        {
          inputEncoding: 'Base64',
          outputEncoding: 'String'
        }
      )}"/>`;
    } else {
      label.textContent += 'by ' + userId;
    }
    compositionContainer.appendChild(comp);
    return comp;
  }
};

export const newComp = (userId = 'Unknown user') => {
  const comp = createComposition(userId);
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  });
  if (State.lastComposition) {
    mainContainer.parentNode.replaceChild(State.lastComposition, mainContainer);
    State.lastComposition = null;
  }
  return comp;
};
