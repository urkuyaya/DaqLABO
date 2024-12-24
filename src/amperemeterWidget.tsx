import { ReactWidget } from '@jupyterlab/apputils';
import * as React from 'react';
import { KernelModel } from './model';

export class AmperemeterWidget extends ReactWidget {
  private _model: KernelModel;

  constructor(model: KernelModel) {
    super();
    this._model = model;
    this.addClass('jp-AmperemeterWidget');
  }

  protected render(): React.ReactElement<any> {
    return (
      <div>
        <h2>Amperemeter</h2>
        <button
          onClick={() => this._model.computeCurrent()}
        >
          Compute Current
        </button>
      </div>
    );
  }
}
