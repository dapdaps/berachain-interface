import Modal from '@/components/modal';
import Content from '../Content';
import dexs from '@/configs/swap';
import { useMemo } from 'react';
import { DEFAULT_CHAIN_ID } from '@/configs';

type Props = {
  outputCurrencyReadonly?: boolean;
  defaultInputCurrency?: any;
  defaultOutputCurrency?: any;
};

export default function SwapModal({
  defaultInputCurrency,
  defaultOutputCurrency,
  outputCurrencyReadonly = false
}: Props) {
  const [templates, tokens] = useMemo(() => {
    let _templates: string[] = [];
    let _tokens: any[] = [];
    Object.values(dexs).forEach((dex: any) => {
      _templates.push(dex.name);
      _tokens = [...dex.tokens[DEFAULT_CHAIN_ID]];
    });
    return [_templates, _tokens];
  }, [dexs]);

  return (
    <Modal open={true} onClose={() => {}}>
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
