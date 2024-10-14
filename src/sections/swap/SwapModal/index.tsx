import Modal from '@/components/modal';
import Content from '../Content';
import { dexs } from '@/configs/swap';
import { useMemo } from 'react';
import { DEFAULT_CHAIN_ID } from '@/configs';

type Props = {
  outputCurrencyReadonly?: boolean;
  defaultInputCurrency?: any;
  defaultOutputCurrency?: any;
  protocols?: any;
  show: boolean;
  onClose: () => void;
};

export default function SwapModal({
  defaultInputCurrency,
  defaultOutputCurrency,
  outputCurrencyReadonly = false,
  protocols,
  show,
  onClose
}: Props) {
  const [templates, tokens] = useMemo(() => {
    let _templates: string[] = [];
    let _tokens: any[] = [];
    const _dexs = protocols
      ? protocols.map((protocol: any) => dexs[protocol.toLowerCase()])
      : Object.values(dexs);

    _dexs.forEach((dex: any) => {
      _templates.push(dex.name);
      _tokens = [...dex.tokens[DEFAULT_CHAIN_ID]];
    });
    return [_templates, _tokens];
  }, [dexs, protocols]);

  return (
    <Modal open={show} onClose={onClose}>
      <Content
        dapp={{
          name: templates,
          tokens: { [DEFAULT_CHAIN_ID]: tokens },
          defaultInputCurrency,
          defaultOutputCurrency
        }}
        outputCurrencyReadonly={outputCurrencyReadonly}
        showSetting={false}
      />
    </Modal>
  );
}
