import { ReactWidget, UseSignal } from '@jupyterlab/apputils';
import * as React from 'react';
import { KernelModel } from './model';

export class VoltmeterWidget extends ReactWidget {
  private _model: KernelModel;

  constructor(model: KernelModel) {
    super();
    this._model = model;
    this.addClass('jp-VoltmeterWidget');
    this.node.style.height = '100%';
    this.node.style.width = '100%';
    console.log('VoltmeterWidget: Constructor executed');
  }

  /**
   * Renderiza la interfaz del widget.
   */
  protected render(): React.ReactElement<any> {
    console.log('VoltmeterWidget: Render method called');
    return (
      <React.Fragment>
        <h2>Voltmeter</h2>
        <button
          className="jp-RunButton"
          onClick={() => {
            console.log('Run button clicked');
            this._model.startSerial();
          }}
        >
          Run
        </button>
        <button
          className="jp-StopButton"
          onClick={() => {
            console.log('Stop button clicked');
            this._model.stopSerial();
          }}
        >
          Stop
        </button>
        <UseSignal signal={this._model.stateChanged}>
          {(): JSX.Element => {
            console.log('Signal recibido en UseSignal.');
            console.log('Resultado actual del modelo:', this._model.output);

            let voltageDisplay: string = '---';

            // Verificar y procesar el JSON del kernel
            if (this._model.output && this._model.output.data) {
              try {
                const data = this._model.output.data as { [key: string]: string };
                console.log('Datos del modelo:', data);

                if (data['text/plain']) {
                  let plainText = data['text/plain'].trim();
                  console.log('Contenido recibido del kernel:', plainText);

                  // Reemplazar comillas simples por comillas dobles
                  plainText = plainText.replace(/'/g, '"');
                  console.log('Contenido modificado para JSON.parse:', plainText);

                  // Verificar si el JSON es válido antes de analizarlo
                  if (plainText.startsWith('{') && plainText.endsWith('}')) {
                    const parsed = JSON.parse(plainText);
                    console.log('JSON parseado:', parsed);
                    if (parsed.voltage !== undefined) {
                      voltageDisplay = `Voltage: ${parsed.voltage.toFixed(2)} V`;
                    } else if (parsed.error) {
                      voltageDisplay = `Error: ${parsed.error}`;
                    } else {
                      voltageDisplay = JSON.stringify(parsed);
                    }
                  } else {
                    console.error('El JSON recibido no es válido:', plainText);
                    voltageDisplay = 'Error: JSON no válido';
                  }
                } else {
                  console.error('No se encontró "text/plain" en los datos:', data);
                }
              } catch (error) {
                console.error('Error al procesar los datos del kernel:', error);
                voltageDisplay = 'Error al procesar los datos';
              }
            } else {
              console.error('No se encontraron datos en el modelo:', this._model.output);
            }

            return (
              <div>
                <label>Voltage: </label>
                <span>{voltageDisplay}</span>
              </div>
            );
          }}
        </UseSignal>
      </React.Fragment>
    );
  }
}
