import { memo } from "react";
import styled from "styled-components";

import { balanceFormated } from "@/utils/balance";

const StyledTokenIcon = styled.img`
  width: 22px;
  height: 22px;
`;

const StyledWrap = styled.div`
  border-radius: 12px;
  border: 1px solid #373a53;
  margin-top: 10px;
  .vchb {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .hvc {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .w-full {
    width: 100%;
  }
`;
const StyledBaseUI = styled.div`
  display: flex;
  flex-direction: column;
  padding: 14px 20px;
  gap: 22px;
`;
const StyledPool = styled(StyledBaseUI)``;

const PoolRemoveToken = ({ percent = 0, tokens = [] }: any) => {
  return (
    <StyledWrap>
      <StyledPool>
        {tokens.map((token: any) => (
          <RowData
            key={token.address}
            name={`Pooled ${token?.symbol}:`}
            value={balanceFormated(
              Number(token?.amount || 0) * (percent / 100) + "",
              4
            )}
            token={token}
          />
        ))}
      </StyledPool>
    </StyledWrap>
  );
};

const StyleRowData = styled.div`
    font-size:16px;
    font-weight:500;
    .value{
      gap:10px;
      img{
        width:22px;
        height:22px;
        border-radius:100px;
      }
    }
  }
`;
const RowData = ({
  name,
  value,
  token
}: {
  name: string;
  value: string;
  token: any;
}) => {
  return (
    <StyleRowData className="vchb">
      <span className="text">{name}</span>
      <div className="hvc value">
        <span>{value}</span>
        <StyledTokenIcon
          src={token?.icon || "/assets/tokens/default_icon.png"}
        />
      </div>
    </StyleRowData>
  );
};

export default memo(PoolRemoveToken);
