import {
  useEnrichedPositionsVault,
  useEnrichedPositionsBoyco,
  useEnrichedPositionsRecipe
} from "royco/hooks";

const accountAddress = "0x8C7f311f5174b636Bc1849e523810b1e9a4B7a1D"; // 0x8C7f311f5174b636Bc1849e523810b1e9a4B7a1D

export default function BoycoPage() {
  const { data: positions } = useEnrichedPositionsVault({
    account_address: accountAddress.toLowerCase(),
    page_index: 0,
    page_size: 10,
    filters: [
      {
        id: "offer_side",
        value: 0
      }
    ],
    custom_token_data: []
  });
  const propsPositionsBoyco = useEnrichedPositionsBoyco({
    account_address: accountAddress.toLowerCase() ?? "",
    page_index: 0,
    page_size: 10
  });

  const propsPositionsRecipe = useEnrichedPositionsRecipe({
    account_address: accountAddress?.toLowerCase() ?? "",
    page_index: 0,
    page_size: 10,
    filters: [
      {
        id: "offer_side",
        value: 0
      }
    ],
    custom_token_data: []
  });

  console.log(
    "vaults",
    positions,
    propsPositionsBoyco.data,
    propsPositionsRecipe.data
  );
  return <div>Boyco</div>;
}
