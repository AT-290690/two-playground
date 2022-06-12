import { editor } from '../main.js';
import {
  consoleElement,
  print,
  compositionContainer,
  canvasContainer,
  alertIcon,
  errorIcon
} from '../extentions/composition.js';

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
const lastLineAutoReturn = source => {
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

    return source;
  }
};
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
const preprocess = source =>
  source
    .replaceAll('<expression>', ';`')
    .replaceAll(
      '<expression/>',
      '`' +
        ".split('\\n').map(x=>x.trim()).filter(Boolean).map(x=>expressions.evaluate(x));"
    );
export const run = () => {
  consoleElement.classList.add('info_line');
  consoleElement.classList.remove('error_line');
  consoleElement.value = '';
  const preprocessed = preprocess(editor.getValue().trim());
  // console.log(preprocessed);
  const out = exe(preprocessed, null);
  if (out) {
    print(out);
  }
  window.expressions.clear();
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
// export const makePlot = expression => {
//   const expr = math.compile(expression);
//   const xValues = math.range(-10, 10, 0.5).toArray();
//   const yValues = xValues.map(function (x) {
//     return expr.evaluate({ x: x });
//   });

//   // render the plot using plotly
//   const trace1 = {
//     x: xValues,
//     y: yValues,
//     type: 'scatter'
//   };
//   const data = [trace1];
//   Plotly.newPlot('plot', data, {
//     margin: {
//       l: 30,
//       r: 30,
//       b: 30,
//       t: 30,
//       pad: 4
//     },
//     height: 250
//   });
// };
