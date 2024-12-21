import { ReactWidget, UseSignal } from '@jupyterlab/apputils';

import * as React from 'react';

import { KernelModel } from './model';

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
          className="jp-example-button"
          onClick={(): void => {
            // Código Python para calcular valores seno
            this._model.execute(`
import numpy as np
result = np.sin(np.linspace(0, 2 * np.pi, 10)).tolist()
result
            `);
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
