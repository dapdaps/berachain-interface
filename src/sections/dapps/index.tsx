import PageBack from '@/components/back';
import PageTitle from '@/components/title';
import IconLeftLeaf from '@public/images/tree/left-leaf.svg';
import IconRightLeaf from '@public/images/tree/right-leaf.svg';
import TrunkSmall from '@public/images/tree/trunk-small.svg';
import TrunkLarge from '@public/images/tree/trunk-large.svg';
import DApp from '@/sections/dapps/components/DApp';
import Floor from '@/sections/dapps/components/Floor';
import dAppsConfig from '@/configs/dapp';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const _dApps: any = {};
for (const dapp in dAppsConfig) {
  _dApps[dapp] = {
    ...dAppsConfig[dapp],
    name: dapp,
    label: dapp.replace('-', ' ').replace(/\b\w/g, char => char.toUpperCase())
  };
}

const List = [
  {
    className: 'w-[174px] h-[112px]',
    dAppClassName: 'absolute left-1/2 -translate-x-1/2 top-[-66px]',
    sticks: [
      'absolute left-[20px] bottom-[48px]',
      'absolute right-[12px] top-1/2 -translate-y-1/2',
      'absolute left-[34px] bottom-[36px]'
    ],
    dApps: [
      {
        ..._dApps['infrared'],
        attachedIcon: ''
      }
    ]
  },
  {
    className: 'w-[230px] h-[132px]',
    dAppClassName: 'absolute top-[-77px] gap-x-[140px] -left-1/3',
    sticks: [
      'absolute left-[46px] bottom-[44px]',
      'absolute left-[34px] bottom-[32px]',
    ],
    dApps: [
      {
        ..._dApps['dolomite'],
        attachedIcon: (
          <TrunkSmall
            className="absolute left-[44%] bottom-[-24%]"
          />)
      },
      {
        ..._dApps['bend'],
        attachedIcon:  (<TrunkSmall
          className="scale-x-[-1] absolute right-[44%] bottom-[-24%]"
        />)
      },
    ]
  },
  {
    className: 'w-[362px] h-[147px]',
    dAppClassName: 'absolute left-1/2 -translate-x-1/2 top-[-90px] gap-y-[27px] lg:gap-x-[86px] md:gap-x-[62px] flex-wrap w-[560px] justify-center',
    sticks: [
      'absolute left-[163px] bottom-[34px]',
      'absolute left-1/2 bottom-[22px]',
    ],
    dApps: [
      {
        className: 'justify-start',
        ..._dApps['kodiak'],
        attachedIcon: (
          <TrunkLarge
            className="absolute left-[44%] bottom-[-28%]"
          />)
      },
      {
        ..._dApps['bex'],
        attachedIcon: (
          <div
            className="absolute left-[44%] bottom-[-16%] w-[17px] h-[32px] rounded-[12px] border-[2px] border-black bg-[#906925]"
          />)
      },
      {
        ..._dApps['ooga-booga'],
        attachedIcon:  (<TrunkLarge
          className="scale-x-[-1] absolute right-[44%] bottom-[-28%]"
        />)
      },
      // TODO add bridge config
      {
        name: 'Stargate',
        label: 'Stargate',
        icon: '/images/dapps/stargate.svg',
        type: 'bridge',
        attachedIcon: '',
        className: '',
        disabled: true,
      },
      // {
      //   name: 'Owlto',
      //   label: 'Owlto',
      //   icon: '/images/dapps/owlto.svg',
      //   type: 'bridge',
      //   attachedIcon:  '',
      //   className: 'ml-[-25px]',
      //   disabled: true,
      // },
    ]
  }
];

const toFirstUpperCase = (word: string) => {
  return word.replace(/\b\w/g, char => char.toUpperCase());
}

const DAppsView = () => {

  const [visibleHeight, setVisibleHeight] = useState(844);

  const router = useRouter();

  const onNavigateTo = (_dApp: any) => {
    router.push(`/${_dApp.type === 'swap' ? 'dex' : _dApp.type}/${_dApp.name}`);
  }

  useEffect(() => {
    const updateViewportHeight = () => {
      setVisibleHeight(window.visualViewport?.height || window.innerHeight);
    };

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);

    return () => {
      window.removeEventListener('resize', updateViewportHeight);
    };
  }, []);

  return (
    <div className="md:bg-[#96d6ff] h-full md:mb-[70px]">
      <PageBack className="absolute left-[12px] top-[17px]" />
      <PageTitle className="pt-[30px] mb-[75px]">dApps</PageTitle>
      <div className='absolute bottom-[233px] md:bottom-[200px] left-1/2 -translate-x-1/2 md:scale-[0.76] md:z-[1]'>
          <div className='w-[95px] h-[415px] bg-[#906925] border-black border-[2px] relative'>
            <IconLeftLeaf className="absolute left-[-25px] bottom-[-10px]" />
            <IconRightLeaf className="absolute right-[-10px] bottom-[-10px]"/>
            <div className='absolute top-[-68px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-y-[14px]'>
              {
                List.map((item, index) => (
                  <Floor
                    key={'floor' + index}
                    className={item.className}
                    sticks={item.sticks}
                  >
                    {
                      item.dApps.length  > 0 && (
                        <div className={`flex ${item.dAppClassName}`}>
                        {
                          item.dApps.map((dApp, idx) => (
                            <div
                              key={`treeNode_${idx}`}
                              className={ 'relative basis-[120px] ' + (dApp.className ?? '')}
                            >
                              <DApp
                                name={dApp.label}
                                icon={dApp.icon}
                                type={toFirstUpperCase(dApp.type)}
                                onClick={() => onNavigateTo(dApp)}
                                disabled={dApp.disabled}
                              />
                              {dApp.attachedIcon ?? null}
                            </div>
                          ))
                        }
                      </div>
                      )
                    }
                  </Floor>
                ))
              }
            </div>
          </div>
        </div>
        <div className='absolute bottom-0 left-0 right-0 hidden md:block' style={{
            backgroundImage: "url('/images/mobile/dapp-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100%',
            height: '75.897vw',
            zIndex: 0
        }}></div>
      <div className='md:w-full md:relative md:overflow-y-scroll md:overflow-x-hidden md:h-[680px]'>

      </div>
    </div>
  )
};

export default DAppsView;