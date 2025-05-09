import models from "./models";

export default async function quoter(props: any) {
  const { template, templates } = props;
  if (template) {
    if (!models[template]) {
      console.error(`can not find ${template} template`);
      return;
    }
    return await singleQuoter(props);
  }
  if (templates) {
    if (templates.length === 0) {
      console.error(`can not find ${template} template`);
      return;
    }
    return await multiQuoter(props);
  }
}

async function singleQuoter(params: any): Promise<any> {
  const { template, ...options } = params;
  const model = models[template];
  const dapp = new model(options.inputCurrency.chainId);
  return await dapp.quoter(options);
}

async function multiQuoter(params: any): Promise<any> {
  const { templates, ...options } = params;

  const filteredTemplates = templates.filter(
    (template: string) => models[template]
  );

  const calls = filteredTemplates.map((template: string) => {
    const model = models[template];
    const dapp = new model(options.inputCurrency.chainId);
    return (async () => {
      try {
        return await dapp.quoter(options);
      } catch (err) {
        console.error(`${template} error`);
      }
    })();
  });
  const result = await Promise.all(calls);

  return result.filter((item: any) => item && item.outputCurrencyAmount);
}
