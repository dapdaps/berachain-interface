'use client';

import { motion } from 'framer-motion';
import DashboardFlowersSvg from '@public/images/background/dashboard-flowers.svg';
import HillsideSvg from '@public/images/background/hillside.svg';
import HillsideRainySvg from '@public/images/background/hillside-rainy.svg';
import GrassSvg from '@public/images/background/grass.svg';
import DashboardBearSvg from '@public/images/background/dashboard-bear.svg';
import DashboardBearRainySvg from '@public/images/background/dashboard-bear-rainy.svg';
import BridgeGroundSvg from '@public/images/background/bridge-ground.svg';
import BridgeGroundRainySvg from '@public/images/background/bridge-ground-rainy.svg';
import LeftTreeSvg from '@public/images/background/tree.svg';
import HallPalace from '@public/images/background/hall-palace.svg'
import HallFlag from '@public/images/background/hall-flag.svg'

import { memo } from 'react';
import { Clouds, DappClouds } from './clouds';
import BeraBgHome from '@/components/bear-background/home';
import Flowers from '@/components/bear-background/components/flowers';
import Ground from '@/components/bear-background/components/ground';


import clsx from 'clsx';
import { useRainyDay } from '@/hooks/use-rainy-day';

import { useActivityStore } from '@/stores/useActivityStore';

const LeftTree = function () {
  return (
    <div className='absolute left-0 bottom-0'>
      <LeftTreeSvg />
    </div>
  );
};

const RightTree = function () {
  return (
    <div className='absolute right-0 bottom-0'>
      <svg
        width='260'
        height='891'
        viewBox='0 0 260 891'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fill-rule='evenodd'
          clip-rule='evenodd'
          d='M152.5 804C156.366 804 159.5 807.134 159.5 811V847C159.5 848.657 160.843 850 162.5 850H252.5C256.366 850 259.5 853.134 259.5 857C259.5 860.866 256.366 864 252.5 864H162.5C153.111 864 145.5 856.389 145.5 847V841H119C115.134 841 112 837.866 112 834C112 830.134 115.134 827 119 827H145.5V811C145.5 807.134 148.634 804 152.5 804Z'
          fill='#906925'
          stroke='black'
          stroke-linecap='round'
        />
        <path
          fill-rule='evenodd'
          clip-rule='evenodd'
          d='M91 179C91 175.134 94.134 172 98 172L226 172C229.866 172 233 175.134 233 179C233 182.866 229.866 186 226 186L98 186C94.134 186 91 182.866 91 179Z'
          fill='#906925'
          stroke='black'
          stroke-linecap='round'
        />
        <path
          d='M213 924C213 924 221.634 308.658 220.727 116.291H286.273L293 924H213Z'
          fill='#906925'
        />
        <path
          d='M231.619 696.67H269.713M252.5 481.5H278.5M263 467.5H278.5M231.619 334H257.5M231.619 322H244M252.5 201H286.273M220.727 116.291C221.634 308.658 213 924 213 924H293L286.273 116.291H220.727Z'
          stroke='black'
          stroke-width='2'
          stroke-linecap='round'
        />
        <rect
          x='208'
          y='1'
          width='60'
          height='60'
          rx='17'
          fill='#B2E946'
          stroke='black'
          stroke-width='2'
          stroke-linejoin='round'
        />
        <rect
          x='209'
          y='6.83353'
          width='57.4775'
          height='53.1667'
          rx='16'
          fill='#9ACA3B'
        />
        <path
          d='M244.51 20.3469H255.163'
          stroke='#7EA82B'
          stroke-width='6'
          stroke-linecap='round'
        />
        <path
          d='M220.837 41.0612H231.49'
          stroke='#7EA82B'
          stroke-width='6'
          stroke-linecap='round'
        />
        <rect
          width='174'
          height='112'
          rx='30'
          transform='matrix(1 0 0 -1 181 157)'
          fill='#527213'
          stroke='black'
          stroke-width='2'
          stroke-linejoin='round'
        />
        <path
          d='M215 81H233'
          stroke='#7EA82B'
          stroke-width='6'
          stroke-linecap='round'
        />
        <path
          d='M200 93H218'
          stroke='#7EA82B'
          stroke-width='6'
          stroke-linecap='round'
        />
        <rect
          x='236'
          y='481'
          width='119'
          height='130'
          rx='20'
          fill='#527213'
          stroke='black'
          stroke-width='2'
          stroke-linejoin='round'
        />
        <path
          d='M259.203 559.868H271.488'
          stroke='#7EA82B'
          stroke-width='6'
          stroke-linecap='round'
        />
        <path
          d='M248.966 551.678H261.251'
          stroke='#7EA82B'
          stroke-width='6'
          stroke-linecap='round'
        />
        <rect
          x='46'
          y='142'
          width='60'
          height='60'
          rx='17'
          fill='#B2E946'
          stroke='black'
          stroke-width='2'
          stroke-linejoin='round'
        />
        <rect
          x='47'
          y='147.834'
          width='57.4775'
          height='53.1667'
          rx='16'
          fill='#9ACA3B'
        />
        <path
          d='M82.5103 161.347H93.1633'
          stroke='#7EA82B'
          stroke-width='6'
          stroke-linecap='round'
        />
        <path
          d='M58.8368 182.061H69.4899'
          stroke='#7EA82B'
          stroke-width='6'
          stroke-linecap='round'
        />
        <rect
          x='86'
          y='676'
          width='131'
          height='131'
          rx='31'
          fill='#B2E946'
          stroke='black'
          stroke-width='2'
          stroke-linejoin='round'
        />
        <rect
          x='87'
          y='687.75'
          width='127.838'
          height='118.25'
          rx='30'
          fill='#9ACA3B'
        />
        <path
          d='M133 731H151'
          stroke='#7EA82B'
          stroke-width='6'
          stroke-linecap='round'
        />
        <path
          d='M118 719H136'
          stroke='#7EA82B'
          stroke-width='6'
          stroke-linecap='round'
        />
        <rect
          x='30'
          y='780'
          width='100'
          height='100'
          rx='31'
          fill='#B2E946'
          stroke='black'
          stroke-width='2'
          stroke-linejoin='round'
        />
        <rect
          x='31'
          y='789.167'
          width='97.1171'
          height='89.8333'
          rx='30'
          fill='#9ACA3B'
        />
        <path
          d='M91 812H109'
          stroke='#7EA82B'
          stroke-width='6'
          stroke-linecap='round'
        />
        <path
          d='M51 847H69'
          stroke='#7EA82B'
          stroke-width='6'
          stroke-linecap='round'
        />
        <rect
          x='149'
          y='718'
          width='174'
          height='112'
          rx='30'
          fill='#527213'
          stroke='black'
          stroke-width='2'
          stroke-linejoin='round'
        />
        <path
          d='M183 794H201'
          stroke='#7EA82B'
          stroke-width='6'
          stroke-linecap='round'
        />
        <path
          d='M168 782H186'
          stroke='#7EA82B'
          stroke-width='6'
          stroke-linecap='round'
        />
        <path
          d='M108.938 521.5C115.337 481.9 140.604 483.667 150.937 477C165.604 481.333 191.537 493.6 177.938 508C160.938 526 150.937 569 137.438 569C123.938 569 111.937 568 98.9373 569C85.9373 570 90.4373 562 101.437 555.5C110.237 550.3 109.104 522.333 108.938 521.5Z'
          fill='#725D41'
          stroke='black'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M111.018 432.5C127.818 432.5 156.684 404.167 169.018 390L173.018 440C159.518 447.5 126.635 467.007 111.018 460.5C93.0177 453 51.5177 441 66.0177 432.5C74.5177 427.517 90.0177 432.5 111.018 432.5Z'
          fill='#725D41'
        />
        <path
          d='M169.018 390C156.684 404.167 127.818 432.5 111.018 432.5C90.0177 432.5 74.5177 427.517 66.0177 432.5C51.5177 441 93.0177 453 111.018 460.5C126.635 467.007 159.518 447.5 173.018 440'
          stroke='black'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <rect
          x='45'
          y='439'
          width='86'
          height='86'
          rx='31'
          fill='#B2E946'
          stroke='black'
          stroke-width='2'
          stroke-linejoin='round'
        />
        <rect
          x='46'
          y='447'
          width='83.2432'
          height='77'
          rx='30'
          fill='#9ACA3B'
        />
        <path
          d='M72.5714 476H88'
          stroke='#7EA82B'
          stroke-width='6'
          stroke-linecap='round'
        />
        <path
          d='M81.1428 491.429H96.5714'
          stroke='#7EA82B'
          stroke-width='6'
          stroke-linecap='round'
        />
        <path
          fill-rule='evenodd'
          clip-rule='evenodd'
          d='M94.5 514.366C98.366 514.366 101.5 517.5 101.5 521.366V537C101.5 538.656 102.843 540 104.5 540H226C229.866 540 233 543.134 233 547C233 550.866 229.866 554 226 554H104.5C95.1112 554 87.5 546.388 87.5 537V521.366C87.5 517.5 90.634 514.366 94.5 514.366Z'
          fill='#906925'
          stroke='black'
          stroke-linecap='round'
        />
        <path
          d='M198.565 333.19C194.888 332.279 191.111 334.723 189.084 337.148C188.41 337.954 188.731 339.123 189.653 339.628C203.547 347.24 203.953 334.525 198.565 333.19Z'
          fill='#725D41'
          stroke='black'
        />
        <path
          d='M208.899 339.117C205.657 335.473 199.547 337.013 195.702 338.767C194.698 339.225 194.372 340.465 194.979 341.386C204.186 355.342 213.483 344.269 208.899 339.117Z'
          fill='#725D41'
          stroke='black'
        />
        <path
          d='M162.892 326.788C157.466 326.38 148.233 319.591 144.294 316.247C130.561 324.958 143.076 343.273 152.149 353.787C156.223 358.507 152.149 383.195 152.149 383.195C118.956 467.5 122 478 131 504C96.5001 536 129.956 567.195 118.956 567.695C107.956 568.195 100.456 573.695 116.456 579.695C132.456 585.695 145.456 608.695 157.956 582.195C170.456 555.695 203.456 551.195 223.456 543.195C274.956 522.593 207.262 387.203 207.456 373.695C207.857 345.764 202.492 346.632 190.27 336.257C170.831 319.754 169.673 327.298 162.892 326.788Z'
          fill='#725D41'
        />
        <path
          d='M131 504C122 478 118.956 467.5 152.149 383.195C152.149 383.195 156.223 358.507 152.149 353.787C143.076 343.273 130.561 324.958 144.294 316.247C148.233 319.591 157.466 326.38 162.892 326.788C169.673 327.298 170.831 319.754 190.27 336.257C202.492 346.632 207.857 345.764 207.456 373.695C207.262 387.203 274.956 522.593 223.456 543.195C203.456 551.195 170.456 555.695 157.956 582.195C145.456 608.695 132.456 585.695 116.456 579.695C100.456 573.695 107.956 568.195 118.956 567.695C129.956 567.195 96.5001 536 131 504ZM131 504C133.603 502.167 148 494.5 152.149 489.5'
          stroke='black'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M250.552 522.717C252.377 528.913 243.418 530.229 237.693 530.022C236.354 529.973 235.601 528.568 236.179 527.36L239.108 521.241C239.23 520.986 239.402 520.76 239.623 520.585C242.606 518.225 248.482 515.686 250.552 522.717Z'
          fill='#725D41'
          stroke='black'
        />
        <ellipse cx='168' cy='332' rx='3' ry='2' fill='black' />
        <path
          d='M160.612 326.331C155.703 324.844 149.179 320.216 145.427 317.185C144.746 316.635 143.778 316.561 143.078 317.087C135.105 323.069 137.737 331.827 142.971 341.188C143.257 341.699 143.754 342.062 144.336 342.127C149.417 342.686 158.583 340.696 162.277 329.044C162.647 327.875 161.785 326.687 160.612 326.331Z'
          fill='#B5966E'
          stroke='black'
        />
        <path
          d='M144 340.951C146.167 341.951 151.7 343.351 156.5 340.951'
          stroke='black'
          stroke-linecap='round'
        />
        {/*#region Tongue*/}
        <path
          d='M153 335.918C151.8 338.718 149.5 341.272 148 341.939C148.539 342.074 150.302 342.575 153.5 341.951C154.253 341.805 154.585 341.68 155.5 341.451C161.5 339.951 154.5 332.418 153 335.918Z'
          fill='#FF7B91'
        />
        {/*#endregion*/}
        <path
          d='M153.5 341.951C154.253 341.805 154.585 341.68 155.5 341.451C161.5 339.951 154.5 332.418 153 335.918C151.8 338.718 149.5 341.272 148 341.939C148.539 342.074 150.302 342.575 153.5 341.951ZM153.5 341.951C154.167 341.258 155.5 339.118 155.5 337.918'
          stroke='black'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M140.942 316.287C139.869 317.55 140.365 319.733 142.049 321.163C143.734 322.592 144.062 321.11 145.135 319.847C146.207 318.583 147.617 318.018 145.932 316.589C144.248 315.159 142.014 315.024 140.942 316.287Z'
          fill='black'
        />
      </svg>

      {/* hat */}
      <svg
        className='absolute bottom-[500px] right-[33px]'
        xmlns='http://www.w3.org/2000/svg'
        width='90'
        height='90'
        viewBox='0 0 90 90'
        fill='none'
      >
        <path
          d='M22.8075 64.1203C25.317 65.5975 32.6393 66.9591 33.0308 65.4361C33.4224 63.9134 31.9047 62.2251 29.2222 62.1582C26.3946 62.0878 22.171 61.2751 20.4479 59.4638C20.1887 60.4005 20.2979 62.6431 22.8075 64.1203Z'
          fill='#4B565C'
          stroke='black'
        />
        <path
          d='M30.4473 64.1711C28.7212 62.8081 31.6964 61.7306 33.0729 61.6732L37.3605 66.18C35.9932 65.8709 32.1733 65.5342 30.4473 64.1711Z'
          fill='#4B565C'
          stroke='black'
        />
        <path
          d='M31.9372 54.1676C36.6037 52.3039 44.3428 45.5851 47.629 42.4587C32.1933 26.234 35.3607 19.7863 38.8739 18.5905C45.891 16.5654 63.1082 17.2145 75.8397 36.0118C91.7542 59.5084 57.7181 79.0101 49.5554 75.5067C41.3927 72.0033 26.1042 56.4973 31.9372 54.1676Z'
          fill='#FFD152'
          stroke='black'
        />
        <path
          d='M57.1316 47.3703C58.2857 45.1991 56.623 45.7077 44.873 31.6648C39.7606 24.9373 38.7525 19.7789 38.8875 18.0407C35.4083 14.1956 28.5724 8.21359 29.0621 15.0458C29.6743 23.5861 40.9158 35.9662 46.2891 41.0501C51.6624 46.134 55.9774 49.5416 57.1316 47.3703Z'
          fill='white'
          stroke='black'
        />
        <path
          d='M45.995 22.0738C47.8036 21.3142 51.8186 21.0213 57.0429 23.7892'
          stroke='black'
          stroke-linecap='round'
        />
        <path
          d='M58.6735 24.9475C59.1393 25.2785 59.8381 25.7749 60.3039 26.1058'
          stroke='black'
          stroke-linecap='round'
        />
        <path
          d='M69.5651 37.2126C67.231 33.1427 61.3164 33.2245 57.2 34.0634C55.9478 34.3186 55.4094 35.7427 56.1618 36.7757C63.553 46.9244 72.916 43.0555 69.5651 37.2126Z'
          fill='#725D41'
          stroke='black'
        />
      </svg>
      {/* arm */}
      <motion.svg
        animate={{
          rotate: [0, 10, 0, 10, 0]
        }}
        style={{
          transformOrigin: 'right center'
        }}
        transition={{
          repeat: Infinity,
          duration: 1,
          repeatDelay: 2,
          ease: 'linear'
        }}
        className='absolute z-[5] bottom-[460px] right-[73px]'
        xmlns='http://www.w3.org/2000/svg'
        width='104'
        height='136'
        viewBox='0 0 104 136'
        fill='none'
      >
        <path
          d='M39.4971 17.0227C48.4119 34.5876 81.4225 70.4987 93.3743 84.6473C109.779 112.765 88.7288 139.006 72.8989 134.379C53.1114 128.595 24.7593 35.4563 21.7348 23.3277C18.7104 11.1991 5.02386 15.6633 5.35878 7.16994C5.6937 -1.32346 28.3535 -4.93341 39.4971 17.0227Z'
          fill='#725D41'
        />
        <path
          d='M93.3743 84.6473C81.4225 70.4987 48.4119 34.5876 39.4971 17.0227C28.3535 -4.93341 5.6937 -1.32346 5.35878 7.16994C5.02386 15.6633 18.7104 11.1991 21.7348 23.3277C24.7593 35.4563 53.1114 128.595 72.8989 134.379'
          stroke='black'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
      </motion.svg>

      <motion.svg
        animate={{
          rotate: [0, 10, 5, 0, -10, -5, 0]
        }}
        style={{
          transformOrigin: '80px top'
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: 'linear'
        }}
        className='absolute bottom-[595px] right-[86px]'
        xmlns='http://www.w3.org/2000/svg'
        width='133'
        height='111'
        viewBox='0 0 133 111'
        fill='none'
      >
        <rect x='75' width='6' height='13' rx='3' fill='#BC9549' />
        <mask
          id='path-2-outside-1_23658_26715'
          maskUnits='userSpaceOnUse'
          x='21'
          y='12'
          width='112'
          height='99'
          fill='black'
        >
          <rect fill='white' x='21' y='12' width='112' height='99' />
          <path
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M101.002 13.1858H98.7236C98.3424 13.0651 97.9364 13 97.5152 13H57.0118C56.5906 13 56.1846 13.0651 55.8034 13.1858H52.8383C47.3941 13.1858 42.9808 17.5991 42.9808 23.0432C42.9808 23.1003 42.9813 23.1572 42.9823 23.2141C38.4146 24.0736 34.959 28.0839 34.959 32.9012C34.959 33.6434 35.041 34.3664 35.1965 35.0617C30.2128 35.5539 26.3197 39.7578 26.3197 44.871C26.3197 46.9798 26.9819 48.934 28.1097 50.5368C24.5243 52.0118 22 55.5395 22 59.6568C22 64.2749 25.1756 68.1512 29.4623 69.2212C27.5289 71.0209 26.3197 73.5882 26.3197 76.4379C26.3197 81.7077 30.4549 86.0117 35.6574 86.2819C35.2068 87.4111 34.959 88.6433 34.959 89.9333C34.959 94.7506 38.4146 98.7608 42.9823 99.6204C42.9813 99.6772 42.9808 99.7342 42.9808 99.7913C42.9808 105.235 47.3941 109.649 52.8383 109.649H101.002C106.446 109.649 110.859 105.235 110.859 99.7913C110.859 99.7447 110.859 99.6982 110.858 99.6518L110.858 99.6205C115.426 98.7611 118.882 94.7507 118.882 89.9333C118.882 88.6433 118.634 87.4111 118.183 86.2819C123.386 86.0114 127.52 81.7075 127.52 76.4379C127.52 73.5882 126.311 71.0209 124.378 69.2212C128.664 68.1511 131.84 64.2748 131.84 59.6568C131.84 55.5396 129.316 52.0119 125.73 50.5369C126.858 48.934 127.52 46.9798 127.52 44.871C127.52 39.758 123.628 35.5542 118.644 35.0618C118.8 34.3665 118.882 33.6434 118.882 32.9012C118.882 28.0837 115.426 24.0734 110.858 23.214C110.859 23.1572 110.859 23.1003 110.859 23.0432C110.859 17.5991 106.446 13.1858 101.002 13.1858Z'
          />
        </mask>
        <path
          fill-rule='evenodd'
          clip-rule='evenodd'
          d='M101.002 13.1858H98.7236C98.3424 13.0651 97.9364 13 97.5152 13H57.0118C56.5906 13 56.1846 13.0651 55.8034 13.1858H52.8383C47.3941 13.1858 42.9808 17.5991 42.9808 23.0432C42.9808 23.1003 42.9813 23.1572 42.9823 23.2141C38.4146 24.0736 34.959 28.0839 34.959 32.9012C34.959 33.6434 35.041 34.3664 35.1965 35.0617C30.2128 35.5539 26.3197 39.7578 26.3197 44.871C26.3197 46.9798 26.9819 48.934 28.1097 50.5368C24.5243 52.0118 22 55.5395 22 59.6568C22 64.2749 25.1756 68.1512 29.4623 69.2212C27.5289 71.0209 26.3197 73.5882 26.3197 76.4379C26.3197 81.7077 30.4549 86.0117 35.6574 86.2819C35.2068 87.4111 34.959 88.6433 34.959 89.9333C34.959 94.7506 38.4146 98.7608 42.9823 99.6204C42.9813 99.6772 42.9808 99.7342 42.9808 99.7913C42.9808 105.235 47.3941 109.649 52.8383 109.649H101.002C106.446 109.649 110.859 105.235 110.859 99.7913C110.859 99.7447 110.859 99.6982 110.858 99.6518L110.858 99.6205C115.426 98.7611 118.882 94.7507 118.882 89.9333C118.882 88.6433 118.634 87.4111 118.183 86.2819C123.386 86.0114 127.52 81.7075 127.52 76.4379C127.52 73.5882 126.311 71.0209 124.378 69.2212C128.664 68.1511 131.84 64.2748 131.84 59.6568C131.84 55.5396 129.316 52.0119 125.73 50.5369C126.858 48.934 127.52 46.9798 127.52 44.871C127.52 39.758 123.628 35.5542 118.644 35.0618C118.8 34.3665 118.882 33.6434 118.882 32.9012C118.882 28.0837 115.426 24.0734 110.858 23.214C110.859 23.1572 110.859 23.1003 110.859 23.0432C110.859 17.5991 106.446 13.1858 101.002 13.1858Z'
          fill='black'
        />
        <path
          d='M98.7236 13.1858L98.4218 14.1392L98.5691 14.1858H98.7236V13.1858ZM55.8034 13.1858V14.1858H55.9578L56.1051 14.1392L55.8034 13.1858ZM42.9823 23.2141L43.1672 24.1968L43.9965 24.0408L43.9821 23.1971L42.9823 23.2141ZM35.1965 35.0617L35.2948 36.0569L36.4189 35.9459L36.1724 34.8435L35.1965 35.0617ZM28.1097 50.5368L28.4901 51.4616L29.648 50.9853L28.9275 49.9614L28.1097 50.5368ZM29.4623 69.2212L30.1436 69.9532L31.4927 68.6974L29.7044 68.251L29.4623 69.2212ZM35.6574 86.2819L36.5862 86.6525L37.1037 85.3557L35.7093 85.2832L35.6574 86.2819ZM42.9823 99.6204L43.9821 99.6374L43.9965 98.7937L43.1672 98.6376L42.9823 99.6204ZM110.858 99.6518L111.858 99.6378L111.858 99.6365L110.858 99.6518ZM110.858 99.6205L110.673 98.6377L109.845 98.7935L109.858 99.6358L110.858 99.6205ZM118.183 86.2819L118.131 85.2832L116.737 85.3557L117.254 86.6525L118.183 86.2819ZM124.378 69.2212L124.136 68.251L122.347 68.6974L123.696 69.9532L124.378 69.2212ZM125.73 50.5369L124.913 49.9615L124.192 50.9854L125.35 51.4617L125.73 50.5369ZM118.644 35.0618L117.668 34.8435L117.422 35.9459L118.546 36.0569L118.644 35.0618ZM110.858 23.214L109.858 23.197L109.844 24.0408L110.673 24.1968L110.858 23.214ZM98.7236 14.1858H101.002V12.1858H98.7236V14.1858ZM97.5152 14C97.8328 14 98.1371 14.049 98.4218 14.1392L99.0254 12.2324C98.5477 12.0812 98.04 12 97.5152 12V14ZM57.0118 14H97.5152V12H57.0118V14ZM56.1051 14.1392C56.3899 14.049 56.6942 14 57.0118 14V12C56.487 12 55.9793 12.0812 55.5016 12.2324L56.1051 14.1392ZM52.8383 14.1858H55.8034V12.1858H52.8383V14.1858ZM43.9808 23.0432C43.9808 18.1514 47.9464 14.1858 52.8383 14.1858V12.1858C46.8419 12.1858 41.9808 17.0468 41.9808 23.0432H43.9808ZM43.9821 23.1971C43.9813 23.1459 43.9808 23.0946 43.9808 23.0432H41.9808C41.9808 23.1059 41.9814 23.1686 41.9824 23.2311L43.9821 23.1971ZM35.959 32.9012C35.959 28.5737 39.0635 24.9691 43.1672 24.1968L42.7974 22.2313C37.7658 23.1782 33.959 27.5941 33.959 32.9012H35.959ZM36.1724 34.8435C36.0328 34.2194 35.959 33.5695 35.959 32.9012H33.959C33.959 33.7173 34.0492 34.5135 34.2206 35.2799L36.1724 34.8435ZM27.3197 44.871C27.3197 40.2771 30.8177 36.499 35.2948 36.0569L35.0982 34.0666C29.6078 34.6088 25.3197 39.2385 25.3197 44.871H27.3197ZM28.9275 49.9614C27.9144 48.5215 27.3197 46.7672 27.3197 44.871H25.3197C25.3197 47.1924 26.0494 49.3464 27.2918 51.1123L28.9275 49.9614ZM23 59.6568C23 55.9588 25.2666 52.7878 28.4901 51.4616L27.7292 49.612C23.782 51.2358 21 55.1203 21 59.6568H23ZM29.7044 68.251C25.8526 67.2895 23 63.805 23 59.6568H21C21 64.7447 24.4987 69.0129 29.2201 70.1915L29.7044 68.251ZM27.3197 76.4379C27.3197 73.8773 28.405 71.5716 30.1436 69.9532L28.7809 68.4893C26.6528 70.4702 25.3197 73.2992 25.3197 76.4379H27.3197ZM35.7093 85.2832C31.0354 85.0405 27.3197 81.1728 27.3197 76.4379H25.3197C25.3197 82.2426 29.8744 86.9828 35.6055 87.2805L35.7093 85.2832ZM35.959 89.9333C35.959 88.7723 36.1819 87.6658 36.5862 86.6525L34.7286 85.9113C34.2318 87.1565 33.959 88.5142 33.959 89.9333H35.959ZM43.1672 98.6376C39.0635 97.8654 35.959 94.2608 35.959 89.9333H33.959C33.959 95.2404 37.7658 99.6563 42.7974 100.603L43.1672 98.6376ZM43.9808 99.7913C43.9808 99.7399 43.9813 99.6886 43.9821 99.6374L41.9824 99.6034C41.9814 99.6659 41.9808 99.7285 41.9808 99.7913H43.9808ZM52.8383 108.649C47.9464 108.649 43.9808 104.683 43.9808 99.7913H41.9808C41.9808 105.788 46.8419 110.649 52.8383 110.649V108.649ZM101.002 108.649H52.8383V110.649H101.002V108.649ZM109.859 99.7913C109.859 104.683 105.894 108.649 101.002 108.649V110.649C106.998 110.649 111.859 105.788 111.859 99.7913H109.859ZM109.859 99.6658C109.859 99.7075 109.859 99.7493 109.859 99.7913H111.859C111.859 99.7401 111.859 99.689 111.858 99.6378L109.859 99.6658ZM109.858 99.6358L109.859 99.6671L111.858 99.6365L111.858 99.6051L109.858 99.6358ZM117.882 89.9333C117.882 94.2609 114.777 97.8656 110.673 98.6377L111.043 100.603C116.075 99.6565 119.882 95.2406 119.882 89.9333H117.882ZM117.254 86.6525C117.659 87.6658 117.882 88.7723 117.882 89.9333H119.882C119.882 88.5142 119.609 87.1564 119.112 85.9113L117.254 86.6525ZM126.52 76.4379C126.52 81.1726 122.805 85.0402 118.131 85.2832L118.235 87.2805C123.966 86.9826 128.52 82.2424 128.52 76.4379H126.52ZM123.696 69.9532C125.435 71.5716 126.52 73.8773 126.52 76.4379H128.52C128.52 73.2991 127.187 70.4702 125.059 68.4892L123.696 69.9532ZM130.84 59.6568C130.84 63.805 127.987 67.2894 124.136 68.251L124.62 70.1914C129.341 69.0128 132.84 64.7446 132.84 59.6568H130.84ZM125.35 51.4617C128.573 52.7879 130.84 55.9588 130.84 59.6568H132.84C132.84 55.1203 130.058 51.236 126.111 49.6121L125.35 51.4617ZM126.52 44.871C126.52 46.7672 125.926 48.5215 124.913 49.9615L126.548 51.1124C127.791 49.3465 128.52 47.1925 128.52 44.871H126.52ZM118.546 36.0569C123.023 36.4993 126.52 40.2773 126.52 44.871H128.52C128.52 39.2387 124.233 34.6091 118.742 34.0666L118.546 36.0569ZM117.882 32.9012C117.882 33.5695 117.808 34.2194 117.668 34.8435L119.62 35.28C119.791 34.5135 119.882 33.7173 119.882 32.9012H117.882ZM110.673 24.1968C114.777 24.9689 117.882 28.5735 117.882 32.9012H119.882C119.882 27.5939 116.075 23.1779 111.043 22.2313L110.673 24.1968ZM109.859 23.0432C109.859 23.0946 109.859 23.1459 109.858 23.197L111.858 23.2311C111.859 23.1685 111.859 23.1059 111.859 23.0432H109.859ZM101.002 14.1858C105.894 14.1858 109.859 18.1514 109.859 23.0432H111.859C111.859 17.0468 106.998 12.1858 101.002 12.1858V14.1858Z'
          fill='black'
          mask='url(#path-2-outside-1_23658_26715)'
        />
        <rect
          x='43.4808'
          y='90.4338'
          width='66.8786'
          height='18.7148'
          rx='9.35742'
          fill='#EA9A2C'
          stroke='black'
        />
        <rect
          x='35.459'
          y='80.5759'
          width='82.9226'
          height='18.7148'
          rx='9.35742'
          fill='#EA9A2C'
          stroke='black'
        />
        <rect
          x='26.8197'
          y='67.0805'
          width='100.201'
          height='18.7148'
          rx='9.35742'
          fill='#EA9A2C'
          stroke='black'
        />
        <rect
          x='0.5'
          y='-0.5'
          width='66.8786'
          height='18.7148'
          rx='9.35742'
          transform='matrix(1 0 0 -1 42.9808 31.9006)'
          fill='#EA9A2C'
          stroke='black'
        />
        <rect
          x='0.5'
          y='-0.5'
          width='82.9226'
          height='18.7148'
          rx='9.35742'
          transform='matrix(1 0 0 -1 34.959 41.7586)'
          fill='#EA9A2C'
          stroke='black'
        />
        <rect
          x='0.5'
          y='-0.5'
          width='100.201'
          height='18.7148'
          rx='9.35742'
          transform='matrix(1 0 0 -1 26.3197 53.7284)'
          fill='#EA9A2C'
          stroke='black'
        />
        <rect
          x='22.5'
          y='50.2994'
          width='108.84'
          height='18.7148'
          rx='9.35742'
          fill='#EA9A2C'
          stroke='black'
        />
        <path
          d='M35.0432 56.6644H111.931'
          stroke='#EBF479'
          stroke-width='6'
          stroke-linecap='round'
        />
        <path
          d='M39.8492 74.9711H107.126'
          stroke='#EBF479'
          stroke-width='6'
          stroke-linecap='round'
        />
        <path
          d='M39.8492 42.1716H107.126'
          stroke='#EBF479'
          stroke-width='6'
          stroke-linecap='round'
        />
        <path
          d='M57.0117 17H97.5152'
          stroke='#EBF479'
          stroke-width='4'
          stroke-linecap='round'
        />
        <path
          d='M52.2057 28.4417H101.634'
          stroke='#EBF479'
          stroke-width='6'
          stroke-linecap='round'
        />
        <path
          d='M52.2057 90.2266H101.634'
          stroke='#EBF479'
          stroke-width='6'
          stroke-linecap='round'
        />
        <ellipse
          cx='122.229'
          cy='56.6651'
          rx='3.4325'
          ry='3.81388'
          fill='#EBF479'
        />
        <ellipse
          cx='116.737'
          cy='74.9718'
          rx='3.4325'
          ry='3.81388'
          fill='#EBF479'
        />
        <ellipse
          cx='116.737'
          cy='42.1724'
          rx='3.4325'
          ry='3.81388'
          fill='#EBF479'
        />
        <ellipse
          cx='109.529'
          cy='28.8238'
          rx='3.08925'
          ry='3.4325'
          fill='#EBF479'
        />
        <ellipse
          cx='109.529'
          cy='90.6087'
          rx='3.08925'
          ry='3.4325'
          fill='#EBF479'
        />
        <path
          d='M96 60C77.3333 74.1667 34.6 102.9 13 104.5C-8.60004 106.1 3.99996 88.8333 13 80'
          stroke='black'
          stroke-linecap='round'
          stroke-linejoin='round'
          stroke-dasharray='2 2'
        />
      </motion.svg>
      {/* left bee */}
      <motion.svg
        animate={{
          x: [0, -10, 0],
          y: [0, -10, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: 'linear'
        }}
        className='absolute bottom-[633px] right-[199px]'
        xmlns='http://www.w3.org/2000/svg'
        width='18'
        height='17'
        viewBox='0 0 18 17'
        fill='none'
      >
        <path
          d='M10.909 1.55037C7.73088 2.1984 7.69587 5.47846 8.15428 7.72667L9.81245 7.79535C9.81245 7.79535 11.1781 7.11012 11.8914 6.36787C14.0462 4.12582 12.8359 1.15748 10.909 1.55037Z'
          fill='white'
          stroke='black'
          stroke-linecap='round'
        />
        <path
          d='M4.10367 12.4721C3.78933 10.9304 4.54329 9.70623 4.95957 9.28682C7.85012 8.69744 10.5442 7.14454 11.3113 5.98456C12.0783 4.82458 16.1289 5.00225 16.3347 8.47279C16.5406 11.9433 12.4994 14.2727 8.64536 15.0585C5.5621 15.6872 4.97834 14.3008 4.30012 13.4355L2.75663 13.2485L4.10367 12.4721Z'
          fill='#FEEF48'
          stroke='black'
          stroke-linecap='round'
        />
        <path
          d='M4.10368 12.4722C3.78934 10.9306 4.47777 9.38496 5.92304 9.09027C5.92304 9.09027 5.09034 9.92828 5.54895 12.1775C6.24355 15.584 8.64537 15.0587 8.64537 15.0587C8.64537 15.0587 5.37124 16.2278 4.30012 13.4356L2.75663 13.2487L4.10368 12.4722Z'
          fill='black'
        />
        <path
          d='M7.36812 8.79563C7.50223 10.2736 7.65471 13.1529 9.51068 14.3802'
          stroke='black'
          stroke-linecap='round'
        />
        <path
          d='M10.0859 7.23791C10.22 8.71593 11.6479 12.4391 13.9807 12.4652'
          stroke='black'
          stroke-linecap='round'
        />
        <path
          d='M4.89616 3.3732C7.82225 1.97371 9.4706 6.12025 9.92901 8.36846L8.43009 9.08087C8.43009 9.08087 6.90521 8.98502 5.9582 8.58131C3.09767 7.36188 1.23855 5.12256 4.89616 3.3732Z'
          fill='white'
          stroke='black'
          stroke-linecap='round'
        />
        <path
          d='M11.9202 7.36567C11.468 6.78881 10.8135 5.38346 11.8126 4.37689'
          stroke='black'
          stroke-linecap='round'
        />
        <path
          d='M14.3 5.87684C14.1952 5.36296 14.1627 4.21883 14.8706 3.75334'
          stroke='black'
          stroke-linecap='round'
        />
      </motion.svg>
      {/* right bee */}
      <motion.svg
        animate={{
          x: [0, 10, 0],
          y: [0, -10, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: 'linear'
        }}
        className='absolute bottom-[667px] right-[72px]'
        xmlns='http://www.w3.org/2000/svg'
        width='17'
        height='16'
        viewBox='0 0 17 16'
        fill='none'
      >
        <path
          d='M6.45559 0.794247C9.63374 1.44227 9.66876 4.72233 9.21035 6.97054L7.55217 7.03922C7.55217 7.03922 6.18655 6.35399 5.47321 5.61174C3.31847 3.36969 4.5287 0.401353 6.45559 0.794247Z'
          fill='white'
          stroke='black'
          stroke-linecap='round'
        />
        <path
          d='M13.261 11.7159C13.5753 10.1743 12.8213 8.95009 12.4051 8.53069C9.5145 7.9413 6.82041 6.3884 6.05335 5.22842C5.28629 4.06844 1.23576 4.24611 1.0299 7.71666C0.824046 11.1872 4.86519 13.5166 8.71926 14.3024C11.8025 14.9311 12.3863 13.5446 13.0645 12.6794L14.608 12.4924L13.261 11.7159Z'
          fill='#FEEF48'
          stroke='black'
          stroke-linecap='round'
        />
        <path
          d='M13.2609 11.7161C13.5753 10.1744 12.8869 8.62883 11.4416 8.33413C11.4416 8.33413 12.2743 9.17214 11.8157 11.4214C11.1211 14.8279 8.71926 14.3025 8.71926 14.3025C8.71926 14.3025 11.9934 15.4717 13.0645 12.6795L14.608 12.4925L13.2609 11.7161Z'
          fill='black'
        />
        <path
          d='M9.9965 8.03949C9.8624 9.51751 9.70991 12.3968 7.85394 13.6241'
          stroke='black'
          stroke-linecap='round'
        />
        <path
          d='M7.27877 6.48178C7.14467 7.9598 5.71677 11.683 3.38394 11.7091'
          stroke='black'
          stroke-linecap='round'
        />
        <path
          d='M12.4685 2.61707C9.54237 1.21758 7.89403 5.36413 7.43562 7.61234L8.93453 8.32474C8.93453 8.32474 10.4594 8.22889 11.4064 7.82519C14.267 6.60575 16.1261 4.36644 12.4685 2.61707Z'
          fill='white'
          stroke='black'
          stroke-linecap='round'
        />
        <path
          d='M5.44443 6.60954C5.89658 6.03268 6.55111 4.62732 5.55206 3.62075'
          stroke='black'
          stroke-linecap='round'
        />
        <path
          d='M3.0646 5.1207C3.16938 4.60683 3.20195 3.4627 2.494 2.9972'
          stroke='black'
          stroke-linecap='round'
        />
      </motion.svg>
    </div>
  );
};

const HatBear = function (props: any) {
  return (
    <div {...{ ...props }}>
      <img src='/images/background/bear.gif' />

      <motion.svg
        animate={{
          rotate: [0, 3, 0, 3, 0, 3, 0]
        }}
        transition={{
          duration: 3.5,
          repeatDelay: 0.5,
          repeat: Infinity
        }}
        style={{
          transformOrigin: 'center bottom'
        }}
        className='absolute top-[14px] right-[112px]'
        width='78'
        height='71'
        viewBox='0 0 78 71'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M45.5519 63.7062C42.6506 63.457 35.8928 60.3264 36.4556 58.8581C37.0183 57.3899 39.2333 56.8926 41.4588 58.3916C43.8047 59.9718 47.7186 61.7554 50.1723 61.2768C49.8411 62.1904 48.4533 63.9554 45.5519 63.7062Z'
          fill='#4B565C'
          stroke='black'
        />
        <path
          d='M39.2944 59.3231C41.4909 59.2116 39.6895 56.61 38.6006 55.7661L32.4951 56.9569C33.7888 57.4969 37.0979 59.4346 39.2944 59.3231Z'
          fill='#4B565C'
          stroke='black'
        />
        <path
          d='M43.8732 50.3051C41.1484 46.0832 38.7305 36.1237 37.8621 31.6718C59.8422 27.3846 60.9943 20.294 58.8228 17.2845C54.2751 11.5696 39.8634 2.12739 18.5979 10.0778C-7.98393 20.0159 8.46848 55.6261 17.1519 57.4975C25.8353 59.3689 47.2792 55.5825 43.8732 50.3051Z'
          fill='#FFD152'
          stroke='black'
        />
        <path
          d='M27.2709 30.1725C27.5875 27.734 28.6484 29.1116 46.3602 24.4686C54.4241 21.945 58.2334 18.3237 59.1301 16.8284C64.1933 15.7088 73.2306 14.7912 68.8744 20.0773C63.4293 26.685 47.095 30.267 39.7702 31.2996C32.4455 32.3321 26.9542 32.6109 27.2709 30.1725Z'
          fill='white'
          stroke='black'
        />
        <path
          d='M51.0001 16C49.9656 14.3333 46.8622 11.7692 41.0001 11'
          stroke='black'
          stroke-linecap='round'
        />
        <path
          d='M39.0001 11C38.4287 11 37.5716 11 37.0001 11'
          stroke='black'
          stroke-linecap='round'
        />
      </motion.svg>
    </div>
  );
};

const DashboardFlowers = function () {
  return (
    <div className='absolute left-0 bottom-0 z-10'>
      <DashboardFlowersSvg />
    </div>
  );
};

const DashboardBear = function (props: any) {
  const { className, isRainyDay } = props;

  return (
    <div className={clsx('absolute right-0 bottom-[31px] z-10', className)}>
      {isRainyDay ? (
        <DashboardBearRainySvg />
      ) : (
        <DashboardBearSvg />
      )}
    </div>
  );
};

const DashboardGround = function (props: any) {
  const { isRainyDay } = props;

  return (
    <div className='absolute bottom-0 left-0 w-full'>
      {
        isRainyDay ? (
          <HillsideRainySvg className='absolute left-0 bottom-[186px]' />
        ) : (
          <HillsideSvg className='absolute left-0 bottom-[186px]' />
        )
      }
      <GrassSvg className='absolute right-0 bottom-[220px]' />
      <div className={clsx('absolute left-0 bottom-0 w-full h-[233px]', isRainyDay ? 'bg-[#90AF4E]' : 'bg-[#B6DF5D]')} />
    </div>
  );
};

const BridgeGround = function (props: any) {
  const { className, isRainyDay } = props;

  return (
    <div className={clsx('absolute left-0 bottom-0 w-full', className)}>
      {
        isRainyDay ? (
          <BridgeGroundRainySvg className='relative mx-auto z-[5]' />
        ) : (
          <BridgeGroundSvg className='relative mx-auto z-[5]' />
        )
      }
      <div
        className={clsx(
          'absolute bottom-[154px] left-[-21px] right-1/2 rounded-[8px] border border-black h-[80px]',
          isRainyDay ? 'bg-[#90AF4E]' : 'bg-[#B6DF5D]'
        )}
      />
      <div
        className={clsx(
          'absolute bottom-[-142px] left-0 right-1/2 h-[297px] border-t border-black',
          isRainyDay ? 'bg-[#7C9744]' : 'bg-[#A7CC55]'
        )}
      />
      <div
        className={clsx(
          'absolute bottom-[154px] right-[-21px] left-1/2 rounded-[8px] border border-black h-[80px]',
          isRainyDay ? 'bg-[#90AF4E]' : 'bg-[#B6DF5D]'
        )}
      />
      <div
        className={clsx(
          'absolute bottom-[-142px] right-0 left-1/2 h-[297px] border-t border-black',
          isRainyDay ? 'bg-[#7C9744]' : 'bg-[#A7CC55]'
        )}
      />
    </div>
  );
};

type PropsType = {
  type: 'home' | 'dashboard' | 'bridge' | 'dapps' | 'dapp' | 'cave' | 'hall';
  children: React.ReactNode;
};

export default memo(function BearBackground({ type, children }: PropsType) {
  const { isRainyDay } = useRainyDay();
  const { isDefaultTheme } = useActivityStore()

  return (
    <div
      className='relative hidden lg:block'
      style={{
        height: 'calc(100dvh - 68px)',
        minHeight: 899,
        overflow: type === "cave" ? "visible" : 'hidden'
      }}
    >
      {type === 'home' ? (
        <BeraBgHome />
      ) : type === 'dashboard' ? (
        <>
          <Clouds isRainyDay={isRainyDay} />
          {
            isDefaultTheme() ? (<>
              <DashboardFlowers />
              <DashboardBear isRainyDay={isRainyDay} />
              <DashboardGround isRainyDay={isRainyDay} />
            </>) : (<div className='absolute left-0 bottom-0 right-0 h-[234px] bg-[#FFF5A9] border-t border-black'>
              <div className='w-full h-full relative'>
                <img src="/images/baddies/yeeze.png" className='w-[287px] absolute bottom-[80%] left-0 z-[8]' alt="" />
                <img src="/images/baddies/dashboard.png" className='w-[505px] absolute bottom-[5%] right-0 z-[8] object-contain' alt="" />
              </div>
            </div>)
          }

        </>
      ) : type === 'bridge' ? (
        <>
          <Clouds isRainyDay={isRainyDay} />

          {
            isDefaultTheme() ? (
              <>
                <HatBear className='absolute w-[360px] left-1/2 bottom-[32px] translate-x-[-676px] z-[8]' />
                <BridgeGround className='z-[7]' isRainyDay={isRainyDay} />
              </>
            ) : (
              (
                <>
                  <img src="/images/baddies/yeeze.png" className='w-[287px] absolute bottom-[10vw] left-0 z-[8]' alt="" />
                  <div className={clsx('absolute left-0 bottom-0 right-0 w-full')}>
                    <img src="/images/baddies/bridge-bg.png" className='w-full min-w-[1600px] h-full object-contain' alt="" />
                  </div>
                </>
              )
            )
          }


        </>
      ) : type === 'dapps' ? (
        <>
          <Clouds isRainyDay={isRainyDay} />
          {
            isDefaultTheme() && (
              <>
                <Flowers />
                <HatBear className='absolute w-[360px] left-[86px] bottom-[32px] z-20' />
              </>
            )
          }
          <Ground isDefaultTheme={isDefaultTheme} isRainyDay={isRainyDay} />

        </>
      ) : type === 'dapp' ? (
        <>
          <DappClouds isRainyDay={isRainyDay} />
          <LeftTree />
          <RightTree />
        </>
      ) : type === 'hall' ? (
        <>
          <DashboardFlowers />
          <div className="absolute right-0 bottom-[213px] z-10">
            <HallPalace />
          </div>
          <div className="absolute left-0 bottom-[220px] z-10">
            <HallFlag />
          </div>
          <Ground isDefaultTheme={isDefaultTheme} isRainyDay={isRainyDay} />
        </>
      ) : (
        <></>
      )}
      <div className='relative z-[12] h-full'>{children}</div>
    </div>
  );
});
