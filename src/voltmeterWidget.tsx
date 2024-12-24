import { ReactWidget, UseSignal } from '@jupyterlab/apputils';
import * as React from 'react';
import { KernelModel } from './model';

export class VoltmeterWidget extends ReactWidget {
  constructor(model: KernelModel) {
    super();
    this._model = model; // Conexión con el modelo
    this.addClass('jp-VoltmeterWidget'); // Clase CSS para personalización
    this.node.style.height = '100%'; // Asegura que ocupe todo el espacio vertical
    this.node.style.width = '100%'; // Asegura que ocupe todo el espacio horizontal
    console.log('VoltmeterWidget: Constructor executed'); // Depuración
  }

  /**
   * Renderiza la interfaz del widget.
   */
  protected render(): React.ReactElement<any> {
    console.log('VoltmeterWidget: Render method called'); // Depuración
    return (
      <React.Fragment>
        <h2>Voltmeter</h2>
        <button
          className="jp-RunButton"
          onClick={() => {
            // Enviar comando al kernel para simular un voltaje
            this._model.execute(`
import random
result = random.uniform(0, 10)
result
          `);
          }}
        >
          Measure Voltage
        </button>
        <UseSignal signal={this._model.stateChanged}>
          {(): JSX.Element => (
            <div>
              <label>Voltage: </label>
              <span>{this._model.output ? JSON.stringify(this._model.output) : '---'}</span>
            </div>
          )}
        </UseSignal>
      </React.Fragment>
    );
  }

  private _model: KernelModel; // Modelo conectado
}
