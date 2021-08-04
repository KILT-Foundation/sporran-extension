import type { AnyJson } from '@polkadot/types/types';

import { PopupAction } from '../../../utilities/popups/types';
import { makeControlledPromise } from '../../../utilities/makeControlledPromise/makeControlledPromise';
import {
  makeTransforms,
  Transforms,
} from '../ChannelTransforms/ChannelTransforms';
import { BrowserChannel } from '../BrowserChannel/BrowserChannel';
import { showPopup } from './PopupMessages';

export class PopupChannel<
  Input = void,
  Output = void,
  JsonInput extends AnyJson = Input extends AnyJson ? Input : never,
  JsonOutput = Output,
> {
  action: PopupAction;
  channel: BrowserChannel<Input, Output, JsonInput, JsonOutput>;
  transform: Transforms<Input, Output, JsonInput, JsonOutput>;

  constructor(
    action: PopupAction,
    transform?: Partial<Transforms<Input, Output, JsonInput, JsonOutput>>,
  ) {
    this.action = action;
    this.channel = new BrowserChannel(`${action}Popup`, true, transform);
    this.transform = makeTransforms(transform);
  }

  async get(
    input: Input,
    sender: Parameters<typeof showPopup>[2],
  ): Promise<Output> {
    const jsonInput = this.transform.inputToJson(input);
    await showPopup(this.action, jsonInput, sender);

    const result = makeControlledPromise<Output>();
    const unsubscribe = this.channel.listenForOutput(result.callback);
    return result.promise.finally(unsubscribe);
  }

  async return(output: Output): Promise<void> {
    await this.channel.return(output);
  }

  async throw(error: string): Promise<void> {
    await this.channel.throw(error);
  }
}
