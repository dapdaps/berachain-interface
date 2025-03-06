
import { MarketplaceContext } from '@/sections/marketplace/context';
import { memo, useContext } from "react";
import InfraredModal from './components/infrared';
import AquaberaModal from './components/aquabera';
export default memo(function Vaults() {

  const {
    vaultsVisible,
    setVaultsVisible,
    vaultsData = {},
    refreshRef
  } = useContext(MarketplaceContext);

  const { data, config, platform, type, vaultsType } = vaultsData;

  return platform === "infrared" ? (
    <InfraredModal
      data={data}
      type={type}
      config={config}
      visible={vaultsVisible}
      setVisible={setVaultsVisible}
      refresh={refreshRef?.current}
    />
  ) : (
    <AquaberaModal
      data={data}
      type={type}
      config={config}
      visible={vaultsVisible}
      setVisible={setVaultsVisible}
      refresh={refreshRef?.current}
    />
  )
})
