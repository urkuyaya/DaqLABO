import { ReactWidget, UseSignal } from '@jupyterlab/apputils';

import * as React from 'react';

import { KernelModel } from './model';

import '../style/index.css'; // Importar los estilos desde index.css


export class KernelView extends ReactWidget {
  constructor(model: KernelModel) {
    super();
    this._model = model;
  }

  protected render(): React.ReactElement<any> {
    return (
      <React.Fragment>
        <button
          key="header-thread"
          className="jp-SineButton"
          onClick={(): void => {
          // Llamar al método computeSine del modelo
          this._model.computeSine();
          }}
        >
          Compute Sine Function
        </button>
        <UseSignal signal={this._model.stateChanged}>
          {(): JSX.Element => (
            <span key="output field">{JSON.stringify(this._model.output)}</span>
          )}
        </UseSignal>
      </React.Fragment>
    );
  }

  private _model: KernelModel;
}
