import {
  canvasContainer,
  compositionContainer,
  consoleElement,
  mainContainer,
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

    case 'RUN':
    case 'SAVE':
      run();
      consoleElement.value = '';
      break;

    case 'SIZE':
      // consoleElement.value = '\nSIZE ' + +PARAMS[0];
      if (+PARAMS === 0) {
        canvasContainer.style.display = 'none';
        // plotContainer.style.display = 'none';
        State.hasPlot = false;
        State.canvasHeight = 0;
        // canvasContainer.style.maxHeight = 250 + 'px';
        // canvasContainer.style.height = 250 + 'px';
      } else {
        canvasContainer.style.display = 'block';
        State.canvasHeight = +253;
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

    // case 'PLOT':
    //   {
    //     plotContainer.style.display = 'block';
    //     State.hasPlot = true;
    //     const plot = editor
    //       .getValue()
    //       .split('plot start')[1]
    //       .split('plot end')[0]
    //       ?.trim();
    //     if (plot) makePlot(plot);
    //   }
    //   break;
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
    default:
      printErrors(CMD + ' does not exist!');
      break;
  }
};
