export const consoleElement = document.getElementById('console');
export const editorContainer = document.getElementById('editor-container');
export const canvasContainer = document.getElementById('canvas-container');
export const mainContainer = document.getElementById('main-container');
export const headerContainer = document.getElementById('header');
export const focusButton = document.getElementById('focus-button');
// export const plotButton = document.getElementById('plot-button');
// export const plotContainer = document.getElementById('plot');
export const appButton = document.getElementById('app-button');
export const fullRunButton = document.getElementById('full-run');
export const alertIcon = document.getElementById('alert');
export const errorIcon = document.getElementById('error');
export const compositionContainer = document.getElementById(
  'composition-container'
);
export const editorResizerElement = document.getElementById('editor-resizer');
export const consoleResizerElement = document.getElementById('console-resizer');

export const print = function (...values) {
  values.forEach(
    x => (consoleElement.value += ` ( ${JSON.stringify(x) ?? undefined} ) `)
  );
  return values;
};
export const printErrors = (errors, args) => {
  consoleElement.classList.remove('info_line');
  consoleElement.classList.add('error_line');
  //consoleElement.style.visibility = 'visible';

  consoleElement.value = errors;
};

export const two = {
  background: (color = 'var(--background-primary)') =>
    (canvasContainer.firstChild.style.background = color),
  requestAnimationFrame: fn => (animation = requestAnimationFrame(fn)),
  destroyComposition: () => {
    canvasContainer.style.background = 'var(--background-primary)';
    canvasContainer.innerHTML = '';
    two.svgEngine?.removeEventListener('update');
  },
  createComposition: (ratio = 1) => {
    // let id = setTimeout(function () {}, 0);
    // while (id--) clearTimeout(id);
    // cancelAnimationFrame(animation);
    canvasContainer.innerHTML = '';
    two.svgEngine?.removeEventListener('update');
    two.svgEngine = new Two({
      width: mainContainer.getBoundingClientRect().width - 5,
      // height: mainContainer.getBoundingClientRect().height * ratio
      height: 250 * ratio
    }).appendTo(canvasContainer);
    return 'Composition created!';
  },
  svgEngine: null,
  scene: (bg = 'var(--background-primary)') => {
    two.createComposition(1);
    two.background(bg);
  },
  makeScene: (bg = 'transparent') => {
    canvasContainer.innerHTML = '';
    two.svgEngine?.removeEventListener('update');
    two.svgEngine = new Two({
      width: mainContainer.getBoundingClientRect().width - 5,
      // height: mainContainer.getBoundingClientRect().height * ratio
      height: 250
    }).appendTo(canvasContainer);
    two.background(bg);
    two.svgEngine.makeGrid = two.makeGrid;
    two.svgEngine.makeFrame = two.makeFrame;
    two.svgEngine.setOrigin = two.setOrigin;
    two.svgEngine.showGroupBounds = two.showGroupBounds;
    return two.svgEngine;
  },
  makeGrid: (size = 50, settings) => {
    size = Math.max(8, size);
    const defaults = {
      color: 'var(--comment)',
      opacity: 0.5,
      linewidth: 1
    };

    const { color, opacity, linewidth } = { ...defaults, ...settings };

    const t = two.svgEngine;
    for (let i = 0; i < t.width / size; i++) {
      const line = t.makeLine(t.width, size * i, 0, i * size);
      line.stroke = color;
      line.opacity = opacity;
      line.linewidth = linewidth;
    }
    for (let i = 0; i < t.height; i++) {
      const line = t.makeLine(i * size, t.height, i * size, 0);
      line.stroke = color;
      line.opacity = opacity;
      line.linewidth = linewidth;
    }
  },

  makeFrame: (items, settings = {}) => {
    const group = two.svgEngine.makeGroup(...items);
    two.showGroupBounds(group, settings);
    return group;
  },
  showGroupBounds: (group, settings = {}) => {
    settings = { padding: [1, 1], stroke: 'lime', linewidth: 1, ...settings };
    const rect = two.svgEngine.makeRectangle(0, 0, 0, 0);
    const padding = settings.padding;
    rect.stroke = settings.stroke;
    rect.noFill();
    rect.linewidth = settings.linewidth;
    if (settings.dashes) {
      rect.dashes = settings.dashes;
    }
    if (settings.fixedSize) {
      rect.width = settings.fixedSize[0];
      rect.height = settings.fixedSize[1];
      group.add(rect);
    } else {
      const offset = { x: Infinity, y: Infinity };
      group.additions.forEach(item => {
        const bounds = item.getBoundingClientRect();
        const origin = item?.origin
          ? { x: item.origin.x + 0.5, y: item.origin.y + 0.5 }
          : item.constructor.name === 'Gt'
          ? { x: 0, y: 0 }
          : { x: 0.5, y: 0.5 };
        const X =
          item.position.x - bounds.width * origin.x - item.linewidth * 0.5;
        const Y =
          item.position.y - bounds.height * origin.y - item.linewidth * 0.5;
        if (X <= offset.x) {
          offset.x = X;
        }
        if (Y <= offset.y) {
          offset.y = Y;
        }
      });
      const bounds = group.getBoundingClientRect();
      group.add(rect);
      const scale = group.scale;
      const last = group.additions[group.additions.length - 1];
      last.position.x = (bounds.width * 0.5) / scale + offset.x;
      last.position.y = (bounds.height * 0.5) / scale + offset.y;
      last.width = (bounds.width * padding[0]) / scale;
      last.height = (bounds.height * padding[1]) / scale;
    }
    return rect;
  },
  width: (ratio = 1) => two.svgEngine.width * ratio,
  height: (ratio = 1) => two.svgEngine.height * ratio,

  setOrigin: (entity, x, y) => {
    entity.additions
      ? entity.additions.forEach(item => {
          item.position.set(item.position.x - x, item.position.y - y);
        })
      : entity.origin.set(x, y);
    return entity;
  },

  noFill: entity => {
    entity.noFill();
    return entity;
  },
  noStroke: entity => {
    entity.noStroke();
    return entity;
  },
  // resize: callback => {
  //   if (callback && typeof callback === 'function') {
  //     two.svgEngine.unbind('resize', callback);
  //     two.svgEngine.removeEventListener('resize');
  //     two.svgEngine.bind('resize', callback);
  //   }
  // },
  draw: callback => {
    if (callback && typeof callback === 'function') {
      two.svgEngine.unbind('update', callback);
      two.svgEngine.removeEventListener('update');
      two.svgEngine.bind('update', callback);
    }
  }
};

two.svgEngine = Object.keys(two)
  .filter(x => x.includes('make'))
  .reduce(
    (acc, key) => {
      acc[key] = () => {
        throw new Error('Calling render methods before creating a scene.');
      };
      return acc;
    },
    {
      removeEventListener: l => null,
      update: () => {
        throw new Error('Calling update before creating a scene.');
      }
    }
  );
window.expressions = math.parser();
window.expr = x =>
  x[0]
    .split('\n')
    .map(x => x.trim())
    .filter(Boolean)
    .map(x => expressions.evaluate(x));
window.Vector = Two.Vector;
window.Engine = {
  render: two.makeScene,
  background: two.background,
  draw: two.draw,
  width: two.width,
  height: two.height,

  print: value => print(value)[0]
};
export const onError = err => two.destroyComposition();
