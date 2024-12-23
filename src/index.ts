import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ITranslator } from '@jupyterlab/translation';

import { ExamplePanel } from './panel';

/**
 * Initialization data for the extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: '@jupyterlab-examples/kernel-messaging:plugin',
  description: 'JupyterLab AVG.',
  autoStart: true,
  requires: [ITranslator],
  activate: activate
};

/**
 * Activate the JupyterLab extension.
 *
 * @param app Jupyter Front End
 * @param translator Jupyter Translator
 */
function activate(app: JupyterFrontEnd, translator: ITranslator): void {
  const manager = app.serviceManager;
  console.log('La extensión JupyterLab AVG ha sido habilitada.');
  const { shell } = app;

  const trans = translator.load('jupyterlab');

  // Crear y añadir el panel directamente al área lateral derecha
  const panel = new ExamplePanel(manager, translator);
  panel.title.label = trans.__('Sine Function Panel'); // Etiqueta corta en la barra lateral
  shell.add(panel, 'right', { rank: 500 }); // Agregar el panel a la barra lateral derecha
}

export default extension;
