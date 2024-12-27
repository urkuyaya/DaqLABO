import { SessionContext, SessionContextDialogs } from '@jupyterlab/apputils';
import {
  ITranslator,
  nullTranslator,
  TranslationBundle
} from '@jupyterlab/translation';

import { ServiceManager } from '@jupyterlab/services';
import { Widget } from '@lumino/widgets';

import { KernelModel } from './model';
import { VoltmeterWidget } from './voltmeterWidget';
import { SineWidget } from './sineWidget';
import { AmperemeterWidget } from './amperemeterWidget';

import '../style/index.css';

/**
 * The class name added to the panels.
 */
const PANEL_CLASS = 'jp-RovaPanel';

/**
 * A panel which has the ability to add other children.
 */
export class ExamplePanel extends Widget {
  private _model: KernelModel;
  private _sessionContext: SessionContext;
  private _translator: ITranslator;
  private _trans: TranslationBundle;
  private _sidebarContainer: HTMLElement;
  private _contentContainer: HTMLElement;
  private _sessionContextDialogs: SessionContextDialogs;

  constructor(manager: ServiceManager.IManager, translator?: ITranslator) {
    super();
    this._translator = translator || nullTranslator;
    this._trans = this._translator.load('jupyterlab');
    this.addClass(PANEL_CLASS);
    this.id = 'kernel-messaging-panel';
    this.title.label = this._trans.__('Kernel Messaging Example View');
    this.title.closable = true;

    // Crear el SessionContext
    this._sessionContext = new SessionContext({
      sessionManager: manager.sessions,
      specsManager: manager.kernelspecs,
      name: 'Extension Examples'
    });
    console.log('SessionContext creado:', this._sessionContext);

    // Crear el diálogo para selección de kernel
    this._sessionContextDialogs = new SessionContextDialogs({ translator });

    // Inicializar el kernel y gestionar errores
    this._initializeSessionContext();

    // Crear el modelo
    this._model = new KernelModel(this._sessionContext);
    console.log('KernelModel inicializado:', this._model);

    // Contenedor principal
    this.node.style.display = 'flex';
    this.node.style.flexDirection = 'column';

    // Sidebar: Contenedor con botones
    this._sidebarContainer = document.createElement('div');
    this._sidebarContainer.className = 'jp-SidebarContainer';

    // Botones del Sidebar
    this._addSidebarButtons();

    // Content Container: Contenedor para los paneles específicos
    this._contentContainer = document.createElement('div');
    this._contentContainer.className = 'jp-ContentContainer';
    this._contentContainer.style.display = 'none';
    this._contentContainer.style.flexGrow = '1';
    this.node.appendChild(this._contentContainer);
  }

  /**
   * Inicializa el SessionContext, asegurando un kernel activo.
   */
  private async _initializeSessionContext(): Promise<void> {
    try {
      const initialized = await this._sessionContext.initialize();
      if (initialized) {
        await this._sessionContextDialogs.selectKernel(this._sessionContext);
        console.log(
          'Kernel inicializado:',
          this._sessionContext.session?.kernel
        );
      } else {
        console.warn('SessionContext no inicializado correctamente.');
      }
    } catch (error) {
      console.error('Error al inicializar el SessionContext:', error);
    }
  }

  /**
   * Agrega los botones del Sidebar.
   */
  private _addSidebarButtons(): void {
    // Botón del osciloscopio
    const oscilloscopeButton = document.createElement('button');
    oscilloscopeButton.className = 'jp-SidebarButton';
    oscilloscopeButton.innerHTML = `<i class="fas fa-wave-square"></i> Oscilloscope`;
    oscilloscopeButton.addEventListener('click', () => {
      this._showPanel('Oscilloscope');
    });

    // Botón del voltímetro
    const voltmeterButton = document.createElement('button');
    voltmeterButton.className = 'jp-SidebarButton';
    voltmeterButton.innerHTML = `<i class="fas fa-bolt"></i> Voltmeter`;
    voltmeterButton.addEventListener('click', () => {
      console.log('Voltmeter button pulsado');
      this._showPanel('Voltmeter');
    });

    // Botón del Sine Function
    const sineButton = document.createElement('button');
    sineButton.className = 'jp-SidebarButton';
    sineButton.innerHTML = `<i class="fas fa-signal"></i> Sine Function`;
    sineButton.addEventListener('click', () => {
      this._showPanel('Sine Function');
    });

    // Añadir los botones al Sidebar
    this._sidebarContainer.appendChild(oscilloscopeButton);
    this._sidebarContainer.appendChild(voltmeterButton);
    this._sidebarContainer.appendChild(sineButton);
    this.node.appendChild(this._sidebarContainer);
  }

  /**
   * Muestra el panel específico asociado al botón pulsado.
   * @param panelType El tipo de panel a mostrar.
   */
  private _showPanel(panelType: string): void {
    console.log(`Cambiando a panel: ${panelType}`);
    this._sidebarContainer.style.display = 'none';
    this._contentContainer.style.display = 'block';
    this._contentContainer.innerHTML = '';

    // Botón "Back"
    const backButton = document.createElement('button');
    backButton.className = 'jp-BackButton';
    backButton.textContent = 'Back';
    backButton.addEventListener('click', () => {
      this._contentContainer.style.display = 'none';
      this._sidebarContainer.style.display = 'flex';
    });
    this._contentContainer.appendChild(backButton);

    // Mostrar el contenido específico
    if (panelType === 'Sine Function') {
      const sineWidget = new SineWidget(this._model);
      this._contentContainer.appendChild(sineWidget.node);
    } else if (panelType === 'Voltmeter') {
      const voltmeterWidget = new VoltmeterWidget(this._model);
      this._contentContainer.appendChild(voltmeterWidget.node);
      voltmeterWidget.update();
    } else if (panelType === 'Amperemeter') {
      const amperemeterWidget = new AmperemeterWidget(this._model);
      this._contentContainer.appendChild(amperemeterWidget.node);
    }
  }
}
