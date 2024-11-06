const ActiveTab = (props: Props) => {
  const {
    children,
    height,
    width,
    isLast,
    isFirst,
    className,
    style,
    marginWidth,
    maxTabs = 2
  } = props;

  return (
    <div
      className={`relative z-[1] flex justify-between items-stretch ${className}`}
      style={{
        width: width + (isLast ? 11 : 0),
        height: height,
        ...style
      }}
    >
      {isFirst ? (
        <div
          className='shrink-0 rounded-tl-[20px] border-t border-l border-black bg-[#FFFDEB]'
          style={{
            width: maxTabs === 3 ? marginWidth / 2 : marginWidth,
            height: height
          }}
        />
      ) : (
        <svg
          width={marginWidth}
          height={height}
          className='shrink-0'
          viewBox='0 0 62 62'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g clipPath='url(#clip0_22123_388)'>
            <g filter='url(#filter0_d_22123_388)'>
              <path
                d='M31 20C31 8.95429 39.9543 0 51 0L305 0C316.046 0 325 8.95431 325 20V40.5496C325 51.5952 333.954 60.5495 345 60.5495L601 60.5497C612.046 60.5497 621 69.504 621 80.5497V730C621 741.046 612.046 750 601 750H-241C-252.046 750 -261 741.046 -261 730V80.5495C-261 69.5038 -252.046 60.5495 -241 60.5495H11C22.0457 60.5495 31 51.5952 31 40.5495V20Z'
                fill='#FFFDEB'
              />
              <path
                d='M31.5 20C31.5 9.23043 40.2305 0.5 51 0.5H305C315.77 0.5 324.5 9.23045 324.5 20V40.5496C324.5 51.8714 333.678 61.0495 345 61.0495L601 61.0497C611.77 61.0497 620.5 69.7802 620.5 80.5497V730C620.5 740.77 611.77 749.5 601 749.5H-241C-251.77 749.5 -260.5 740.77 -260.5 730V80.5495C-260.5 69.78 -251.77 61.0495 -241 61.0495H11C22.3219 61.0495 31.5 51.8714 31.5 40.5495V20Z'
                stroke='black'
              />
            </g>
          </g>
          <defs>
            <filter
              id='filter0_d_22123_388'
              x='-261'
              y='0'
              width='892'
              height='760'
              filterUnits='userSpaceOnUse'
              colorInterpolationFilters='sRGB'
            >
              <feFlood floodOpacity='0' result='BackgroundImageFix' />
              <feColorMatrix
                in='SourceAlpha'
                type='matrix'
                values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                result='hardAlpha'
              />
              <feOffset dx='10' dy='10' />
              <feComposite in2='hardAlpha' operator='out' />
              <feColorMatrix
                type='matrix'
                values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'
              />
              <feBlend
                mode='normal'
                in2='BackgroundImageFix'
                result='effect1_dropShadow_22123_388'
              />
              <feBlend
                mode='normal'
                in='SourceGraphic'
                in2='effect1_dropShadow_22123_388'
                result='shape'
              />
            </filter>
            <clipPath id='clip0_22123_388'>
              <rect width='62' height='62' fill='white' />
            </clipPath>
          </defs>
        </svg>
      )}
      <div
        className="bg-[url('/images/tabs/icon-tab-bg.svg')] grow flex justify-center items-center"
        style={{
          height: height,
          paddingRight: isFirst && maxTabs < 3 ? marginWidth / 2 : 0
        }}
      >
        {children}
      </div>
      {isLast ? (
        <svg
          width={marginWidth}
          height={height}
          className='shrink-0'
          viewBox='0 0 62 62'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g clipPath='url(#clip0_22123_394)'>
            <g filter='url(#filter0_d_22123_394)'>
              <path
                d='M51 20C51 8.95429 42.0457 0 31 0L-223 0C-234.046 0 -243 8.95431 -243 20V40.5495C-243 51.5952 -251.954 60.5495 -263 60.5495H-811C-822.046 60.5495 -831 69.5038 -831 80.5495V730C-831 741.046 -822.046 750 -811 750H31C42.0457 750 51 741.046 51 730V20Z'
                fill='#FFFDEB'
              />
              <path
                d='M50.5 20C50.5 9.23043 41.7696 0.5 31 0.5H-223C-233.77 0.5 -242.5 9.23045 -242.5 20V40.5495C-242.5 51.8714 -251.678 61.0495 -263 61.0495H-811C-821.77 61.0495 -830.5 69.78 -830.5 80.5495V730C-830.5 740.77 -821.77 749.5 -811 749.5H31C41.7695 749.5 50.5 740.77 50.5 730V20Z'
                stroke='black'
              />
            </g>
          </g>
          <defs>
            <filter
              id='filter0_d_22123_394'
              x='-831'
              y='0'
              width='892'
              height='760'
              filterUnits='userSpaceOnUse'
              colorInterpolationFilters='sRGB'
            >
              <feFlood floodOpacity='0' result='BackgroundImageFix' />
              <feColorMatrix
                in='SourceAlpha'
                type='matrix'
                values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                result='hardAlpha'
              />
              <feOffset dx='10' dy='10' />
              <feComposite in2='hardAlpha' operator='out' />
              <feColorMatrix
                type='matrix'
                values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'
              />
              <feBlend
                mode='normal'
                in2='BackgroundImageFix'
                result='effect1_dropShadow_22123_394'
              />
              <feBlend
                mode='normal'
                in='SourceGraphic'
                in2='effect1_dropShadow_22123_394'
                result='shape'
              />
            </filter>
            <clipPath id='clip0_22123_394'>
              <rect width='62' height='62' fill='white' />
            </clipPath>
          </defs>
        </svg>
      ) : (
        <svg
          width={marginWidth}
          height={height}
          className='shrink-0'
          viewBox='0 0 62 62'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g clipPath='url(#clip0_22123_389)'>
            <g filter='url(#filter0_d_22123_389)'>
              <path
                d='M-263 20C-263 8.95429 -254.046 0 -243 0L11 0C22.0457 0 31 8.95431 31 20V40.5496C31 51.5952 39.9543 60.5495 51 60.5495L307 60.5497C318.046 60.5497 327 69.504 327 80.5497V730C327 741.046 318.046 750 307 750H-535C-546.046 750 -555 741.046 -555 730V80.5495C-555 69.5038 -546.046 60.5495 -535 60.5495H-283C-271.954 60.5495 -263 51.5952 -263 40.5495V20Z'
                fill='#FFFDEB'
              />
              <path
                d='M-262.5 20C-262.5 9.23043 -253.77 0.5 -243 0.5H11C21.7696 0.5 30.5 9.23045 30.5 20V40.5496C30.5 51.8714 39.6782 61.0495 51 61.0495L307 61.0497C317.77 61.0497 326.5 69.7802 326.5 80.5497V730C326.5 740.77 317.77 749.5 307 749.5H-535C-545.77 749.5 -554.5 740.77 -554.5 730V80.5495C-554.5 69.78 -545.77 61.0495 -535 61.0495H-283C-271.678 61.0495 -262.5 51.8714 -262.5 40.5495V20Z'
                stroke='black'
              />
            </g>
          </g>
          <defs>
            <filter
              id='filter0_d_22123_389'
              x='-555'
              y='0'
              width='892'
              height='760'
              filterUnits='userSpaceOnUse'
              colorInterpolationFilters='sRGB'
            >
              <feFlood floodOpacity='0' result='BackgroundImageFix' />
              <feColorMatrix
                in='SourceAlpha'
                type='matrix'
                values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                result='hardAlpha'
              />
              <feOffset dx='10' dy='10' />
              <feComposite in2='hardAlpha' operator='out' />
              <feColorMatrix
                type='matrix'
                values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'
              />
              <feBlend
                mode='normal'
                in2='BackgroundImageFix'
                result='effect1_dropShadow_22123_389'
              />
              <feBlend
                mode='normal'
                in='SourceGraphic'
                in2='effect1_dropShadow_22123_389'
                result='shape'
              />
            </filter>
            <clipPath id='clip0_22123_389'>
              <rect width='62' height='62' fill='white' />
            </clipPath>
          </defs>
        </svg>
      )}
    </div>
  );
};

export default ActiveTab;

interface Props {
  width: number;
  height: number;
  marginWidth: number;
  currentTabIndex: number;
  total: number;
  children: any;
  isLast?: boolean;
  isFirst?: boolean;
  className?: string;
  style?: React.CSSProperties;
  maxTabs?: number;
}
