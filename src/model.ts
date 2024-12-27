import { ISessionContext } from '@jupyterlab/apputils';

import { IOutput } from '@jupyterlab/nbformat';

import { Kernel, KernelMessage } from '@jupyterlab/services';

import { ISignal, Signal } from '@lumino/signaling';

export class KernelModel {
  constructor(session: ISessionContext) {
    this._sessionContext = session;
  }

  get future(): Kernel.IFuture<
    KernelMessage.IExecuteRequestMsg,
    KernelMessage.IExecuteReplyMsg
  > | null {
    return this._future;
  }

  set future(
    value: Kernel.IFuture<
      KernelMessage.IExecuteRequestMsg,
      KernelMessage.IExecuteReplyMsg
    > | null
  ) {
    this._future = value;
    if (!value) {
      return;
    }
    value.onIOPub = this._onIOPub;
  }

  get output(): IOutput | null {
    return this._output;
  }

  get stateChanged(): ISignal<KernelModel, void> {
    // codigo
    this._stateChanged.emit();
    console.log('Signal emitido para actualizar el estado.');
    // codigo
    return this._stateChanged;
  }

  execute(code: string): void {
    console.log('Ejecutando CODE AVG'); // Depuración
    console.log('SessionContext:', this._sessionContext);
    console.log('Kernel:', this._sessionContext?.session?.kernel);

    if (!this._sessionContext || !this._sessionContext.session?.kernel) {
      console.warn('No hay session or kernel available to execute code.');
      return;
    }
    console.log('Código enviado al kernel AVG2:', code); // Depuración
    this.future = this._sessionContext.session?.kernel?.requestExecute({
      code
    });
  }

  /**
   * Ejecuta el cálculo de una señal seno utilizando el kernel.
   */
  public computeSine(): void {
    const code = `
    import numpy as np
    result = np.sin(np.linspace(0, 2 * np.pi, 10)).tolist()
    result
  `;
    this.execute(code);
  }
  /**
   * Ejecuta el cálculo de un voltaje aleatorio.
   */

  public computeVoltage(): void {
    const code = `
import serial
arduino = serial.Serial(port='/dev/ttyUSB0', baudrate=9600, timeout=1)
data = arduino.readline().decode('utf-8').strip()
arduino.close()
data
    `;
    console.log('Código enviado al kernel AVG:', code); // Depuración
    this.execute(code);
  }
  /**
   * Ejecuta el cálculo de una corriente aleatoria.
   */
  public computeCurrent(): void {
    const code = `
      import random
      result = random.uniform(0, 5)
      result
    `;
    this.execute(code);
  }
  private _onIOPub = (msg: KernelMessage.IIOPubMessage): void => {
    console.log('Mensaje recibido del kernel AVG:', msg); // Depuración
    const msgType = msg.header.msg_type;
    switch (msgType) {
      case 'execute_result':
      case 'display_data':
      case 'update_display_data':
        this._output = msg.content as IOutput;
        console.log(this._output);
        this._stateChanged.emit();
        break;
      default:
        break;
    }
    return;
  };

  private _future: Kernel.IFuture<
    KernelMessage.IExecuteRequestMsg,
    KernelMessage.IExecuteReplyMsg
  > | null = null;
  private _output: IOutput | null = null;
  private _sessionContext: ISessionContext;
  private _stateChanged = new Signal<KernelModel, void>(this);
}
