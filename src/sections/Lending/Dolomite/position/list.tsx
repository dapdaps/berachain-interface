import Position from '@/sections/Lending/Dolomite/position/index';
import PositionAdd from '@/sections/Lending/Dolomite/position/add';

const PositionList = (props: any) => {
  const { data } = props;

  const positionList = data?.positionList || [];

  return (
    <div className="max-h-[calc(100vh_-_300px)] overflow-x-hidden overflow-y-auto">
      {
        positionList.map((position: any, idx: number) => (
          <Position key={idx} position={position} />
        ))
      }
      <PositionAdd markets={data?.markets} />
    </div>
  );
};

export default PositionList;

interface Props {}
