import { ReactWidget } from '@jupyterlab/apputils';
import * as React from 'react';
import { KernelModel } from './model';

export class SineWidget extends ReactWidget {
  private _model: KernelModel;

  constructor(model: KernelModel) {
    super();
    this._model = model;
    this.addClass('jp-SineWidget');
  }

  protected render(): React.ReactElement<any> {
    return (
      <div>
        <h2>Signal Sine</h2>
        <button
          onClick={() => this._model.computeSine()}
        >
          Compute Sine Wave
        </button>
      </div>
    );
  }
}
