'use client';

import { AnimatePresence, motion } from 'framer-motion';
import ArrowTopSvg from "@public/images/background/arrow-top.svg";
import BearCircleSvg from "@public/images/background/bear-circle.svg";
import BearSvg from "@public/images/background/bear.svg";
import BridgeSvg from "@public/images/background/bridge.svg";
import CloudSvg from "@public/images/background/cloud.svg";
import DappsSvg from "@public/images/background/dapps.svg";
import DashboardSvg from "@public/images/background/dashboard.svg";
import ExploreSvg from "@public/images/background/explore.svg";
import FlowersSvg from "@public/images/background/flowers.svg"

import DashboardFlowersSvg from '@public/images/background/dashboard-flowers.svg'
import HillsideSvg from '@public/images/background/hillside.svg'
import GrassSvg from '@public/images/background/grass.svg'
import DashboardBearSvg from '@public/images/background/dashboard-bear.svg'
import BridgeGroudSvg from '@public/images/background/bridge-groud.svg'
import LeftTreeSvg from '@public/images/background/tree.svg'
import HatBearSvg from '@public/images/background/hat-bear.svg'

import { memo } from "react";

const Clouds = function () {
  return (
    <>
      <motion.div
        initial={{
          right: -212
        }}
        animate={{
          right: window?.screen?.availWidth,
        }}
        transition={{
          duration: 12,
          ease: "linear",
          repeat: Infinity
        }}
        className="absolute top-[109px] "
      >
        <CloudSvg />
      </motion.div>
      <motion.div
        initial={{
          right: -212
        }}
        animate={{
          right: window?.screen?.availWidth,
        }}
        transition={{
          duration: 12,
          ease: "linear",
          repeat: Infinity,
          delay: 4
        }}
        className="absolute top-[13px]">
        <CloudSvg />
      </motion.div>

      <motion.div
        initial={{
          right: -212
        }}
        animate={{
          right: window?.screen?.availWidth,
        }}
        transition={{
          duration: 12,
          ease: "linear",
          repeat: Infinity,
          delay: 8
        }}
        className="absolute top-[143px]">
        <CloudSvg />
      </motion.div>
    </>
  )
}
const DappClouds = function () {
  return (
    <>
      <motion.div
        initial={{
          right: -212
        }}
        animate={{
          right: window?.screen?.availWidth,
        }}
        transition={{
          duration: 12,
          ease: "linear",
          repeat: Infinity,
        }}
        className="absolute left-[73px] bottom-[479px]">
        <CloudSvg />
      </motion.div>
      <motion.div
        initial={{
          right: -212
        }}
        animate={{
          right: window?.screen?.availWidth,
        }}
        transition={{
          duration: 12,
          ease: "linear",
          repeat: Infinity,
          delay: 4
        }}
        className="absolute right-[248px] bottom-[559px]">
        <CloudSvg />
      </motion.div>
      <motion.div
        initial={{
          right: -212
        }}
        animate={{
          right: window?.screen?.availWidth,
        }}
        transition={{
          duration: 12,
          ease: "linear",
          repeat: Infinity,
          delay: 8
        }}
        className="absolute right-[455px] bottom-[129px]">
        <CloudSvg />
      </motion.div>
    </>
  )
}
const LeftTree = function () {
  return (
    <div className="absolute left-0 bottom-0">
      <LeftTreeSvg />
    </div>
  )
}

const RightTree = function () {
  return (
    <div className="absolute right-0 bottom-0">
      <motion.svg width="260" height="891" viewBox="0 0 260 891" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M152.5 804C156.366 804 159.5 807.134 159.5 811V847C159.5 848.657 160.843 850 162.5 850H252.5C256.366 850 259.5 853.134 259.5 857C259.5 860.866 256.366 864 252.5 864H162.5C153.111 864 145.5 856.389 145.5 847V841H119C115.134 841 112 837.866 112 834C112 830.134 115.134 827 119 827H145.5V811C145.5 807.134 148.634 804 152.5 804Z"
          fill="#906925"
          stroke="black"
          stroke-linecap="round"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M91 179C91 175.134 94.134 172 98 172L226 172C229.866 172 233 175.134 233 179C233 182.866 229.866 186 226 186L98 186C94.134 186 91 182.866 91 179Z"
          fill="#906925"
          stroke="black"
          stroke-linecap="round"
        />
        <path d="M213 924C213 924 221.634 308.658 220.727 116.291H286.273L293 924H213Z" fill="#906925" />
        <path
          d="M231.619 696.67H269.713M252.5 481.5H278.5M263 467.5H278.5M231.619 334H257.5M231.619 322H244M252.5 201H286.273M220.727 116.291C221.634 308.658 213 924 213 924H293L286.273 116.291H220.727Z"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
        />
        <rect
          x="208"
          y="1"
          width="60"
          height="60"
          rx="17"
          fill="#B2E946"
          stroke="black"
          stroke-width="2"
          stroke-linejoin="round"
        />
        <rect x="209" y="6.83353" width="57.4775" height="53.1667" rx="16" fill="#9ACA3B" />
        <path d="M244.51 20.3469H255.163" stroke="#7EA82B" stroke-width="6" stroke-linecap="round" />
        <path d="M220.837 41.0612H231.49" stroke="#7EA82B" stroke-width="6" stroke-linecap="round" />
        <rect
          width="174"
          height="112"
          rx="30"
          transform="matrix(1 0 0 -1 181 157)"
          fill="#527213"
          stroke="black"
          stroke-width="2"
          stroke-linejoin="round"
        />
        <path d="M215 81H233" stroke="#7EA82B" stroke-width="6" stroke-linecap="round" />
        <path d="M200 93H218" stroke="#7EA82B" stroke-width="6" stroke-linecap="round" />
        <rect
          x="236"
          y="481"
          width="119"
          height="130"
          rx="20"
          fill="#527213"
          stroke="black"
          stroke-width="2"
          stroke-linejoin="round"
        />
        <path d="M259.203 559.868H271.488" stroke="#7EA82B" stroke-width="6" stroke-linecap="round" />
        <path d="M248.966 551.678H261.251" stroke="#7EA82B" stroke-width="6" stroke-linecap="round" />
        <rect
          x="46"
          y="142"
          width="60"
          height="60"
          rx="17"
          fill="#B2E946"
          stroke="black"
          stroke-width="2"
          stroke-linejoin="round"
        />
        <rect x="47" y="147.834" width="57.4775" height="53.1667" rx="16" fill="#9ACA3B" />
        <path d="M82.5103 161.347H93.1633" stroke="#7EA82B" stroke-width="6" stroke-linecap="round" />
        <path d="M58.8368 182.061H69.4899" stroke="#7EA82B" stroke-width="6" stroke-linecap="round" />
        <rect x="118" y="186" width="6" height="13" rx="3" fill="#BC9549" />
        <mask
          id="path-20-outside-1_22057_76"
          maskUnits="userSpaceOnUse"
          x="64"
          y="198"
          width="112"
          height="99"
          fill="black"
        >
          <rect fill="white" x="64" y="198" width="112" height="99" />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M144.002 199.186H141.724C141.342 199.065 140.936 199 140.515 199H100.012C99.5906 199 99.1846 199.065 98.8034 199.186H95.8383C90.3941 199.186 85.9808 203.599 85.9808 209.043C85.9808 209.1 85.9813 209.157 85.9823 209.214C81.4146 210.074 77.959 214.084 77.959 218.901C77.959 219.643 78.041 220.366 78.1965 221.062C73.2128 221.554 69.3197 225.758 69.3197 230.871C69.3197 232.98 69.9819 234.934 71.1097 236.537C67.5243 238.012 65 241.54 65 245.657C65 250.275 68.1756 254.151 72.4623 255.221C70.5289 257.021 69.3197 259.588 69.3197 262.438C69.3197 267.708 73.4549 272.012 78.6574 272.282C78.2068 273.411 77.959 274.643 77.959 275.933C77.959 280.751 81.4146 284.761 85.9823 285.62C85.9813 285.677 85.9808 285.734 85.9808 285.791C85.9808 291.235 90.3941 295.649 95.8383 295.649H144.002C149.446 295.649 153.859 291.235 153.859 285.791C153.859 285.745 153.859 285.698 153.858 285.652L153.858 285.62C158.426 284.761 161.882 280.751 161.882 275.933C161.882 274.643 161.634 273.411 161.183 272.282C166.386 272.011 170.52 267.708 170.52 262.438C170.52 259.588 169.311 257.021 167.378 255.221C171.664 254.151 174.84 250.275 174.84 245.657C174.84 241.54 172.316 238.012 168.73 236.537C169.858 234.934 170.52 232.98 170.52 230.871C170.52 225.758 166.628 221.554 161.644 221.062C161.8 220.366 161.882 219.643 161.882 218.901C161.882 214.084 158.426 210.073 153.858 209.214C153.859 209.157 153.859 209.1 153.859 209.043C153.859 203.599 149.446 199.186 144.002 199.186Z"
          />
        </mask>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M144.002 199.186H141.724C141.342 199.065 140.936 199 140.515 199H100.012C99.5906 199 99.1846 199.065 98.8034 199.186H95.8383C90.3941 199.186 85.9808 203.599 85.9808 209.043C85.9808 209.1 85.9813 209.157 85.9823 209.214C81.4146 210.074 77.959 214.084 77.959 218.901C77.959 219.643 78.041 220.366 78.1965 221.062C73.2128 221.554 69.3197 225.758 69.3197 230.871C69.3197 232.98 69.9819 234.934 71.1097 236.537C67.5243 238.012 65 241.54 65 245.657C65 250.275 68.1756 254.151 72.4623 255.221C70.5289 257.021 69.3197 259.588 69.3197 262.438C69.3197 267.708 73.4549 272.012 78.6574 272.282C78.2068 273.411 77.959 274.643 77.959 275.933C77.959 280.751 81.4146 284.761 85.9823 285.62C85.9813 285.677 85.9808 285.734 85.9808 285.791C85.9808 291.235 90.3941 295.649 95.8383 295.649H144.002C149.446 295.649 153.859 291.235 153.859 285.791C153.859 285.745 153.859 285.698 153.858 285.652L153.858 285.62C158.426 284.761 161.882 280.751 161.882 275.933C161.882 274.643 161.634 273.411 161.183 272.282C166.386 272.011 170.52 267.708 170.52 262.438C170.52 259.588 169.311 257.021 167.378 255.221C171.664 254.151 174.84 250.275 174.84 245.657C174.84 241.54 172.316 238.012 168.73 236.537C169.858 234.934 170.52 232.98 170.52 230.871C170.52 225.758 166.628 221.554 161.644 221.062C161.8 220.366 161.882 219.643 161.882 218.901C161.882 214.084 158.426 210.073 153.858 209.214C153.859 209.157 153.859 209.1 153.859 209.043C153.859 203.599 149.446 199.186 144.002 199.186Z"
          fill="black"
        />
        <path
          d="M141.724 199.186L141.422 200.139L141.569 200.186H141.724V199.186ZM98.8034 199.186V200.186H98.9578L99.1051 200.139L98.8034 199.186ZM85.9823 209.214L86.1672 210.197L86.9965 210.041L86.9821 209.197L85.9823 209.214ZM78.1965 221.062L78.2948 222.057L79.4189 221.946L79.1724 220.843L78.1965 221.062ZM71.1097 236.537L71.4901 237.462L72.648 236.985L71.9275 235.961L71.1097 236.537ZM72.4623 255.221L73.1436 255.953L74.4927 254.697L72.7044 254.251L72.4623 255.221ZM78.6574 272.282L79.5862 272.652L80.1037 271.356L78.7093 271.283L78.6574 272.282ZM85.9823 285.62L86.9821 285.637L86.9965 284.794L86.1672 284.638L85.9823 285.62ZM153.858 285.652L154.858 285.638L154.858 285.636L153.858 285.652ZM153.858 285.62L153.673 284.638L152.845 284.793L152.858 285.636L153.858 285.62ZM161.183 272.282L161.131 271.283L159.737 271.356L160.254 272.652L161.183 272.282ZM167.378 255.221L167.136 254.251L165.347 254.697L166.696 255.953L167.378 255.221ZM168.73 236.537L167.913 235.961L167.192 236.985L168.35 237.462L168.73 236.537ZM161.644 221.062L160.668 220.844L160.422 221.946L161.546 222.057L161.644 221.062ZM153.858 209.214L152.858 209.197L152.844 210.041L153.673 210.197L153.858 209.214ZM141.724 200.186H144.002V198.186H141.724V200.186ZM140.515 200C140.833 200 141.137 200.049 141.422 200.139L142.025 198.232C141.548 198.081 141.04 198 140.515 198V200ZM100.012 200H140.515V198H100.012V200ZM99.1051 200.139C99.3899 200.049 99.6942 200 100.012 200V198C99.487 198 98.9793 198.081 98.5016 198.232L99.1051 200.139ZM95.8383 200.186H98.8034V198.186H95.8383V200.186ZM86.9808 209.043C86.9808 204.151 90.9464 200.186 95.8383 200.186V198.186C89.8419 198.186 84.9808 203.047 84.9808 209.043H86.9808ZM86.9821 209.197C86.9813 209.146 86.9808 209.095 86.9808 209.043H84.9808C84.9808 209.106 84.9814 209.169 84.9824 209.231L86.9821 209.197ZM78.959 218.901C78.959 214.574 82.0635 210.969 86.1672 210.197L85.7974 208.231C80.7658 209.178 76.959 213.594 76.959 218.901H78.959ZM79.1724 220.843C79.0328 220.219 78.959 219.569 78.959 218.901H76.959C76.959 219.717 77.0492 220.513 77.2206 221.28L79.1724 220.843ZM70.3197 230.871C70.3197 226.277 73.8177 222.499 78.2948 222.057L78.0982 220.067C72.6078 220.609 68.3197 225.238 68.3197 230.871H70.3197ZM71.9275 235.961C70.9144 234.521 70.3197 232.767 70.3197 230.871H68.3197C68.3197 233.192 69.0494 235.346 70.2918 237.112L71.9275 235.961ZM66 245.657C66 241.959 68.2666 238.788 71.4901 237.462L70.7292 235.612C66.782 237.236 64 241.12 64 245.657H66ZM72.7044 254.251C68.8526 253.29 66 249.805 66 245.657H64C64 250.745 67.4987 255.013 72.2201 256.191L72.7044 254.251ZM70.3197 262.438C70.3197 259.877 71.405 257.572 73.1436 255.953L71.7809 254.489C69.6528 256.47 68.3197 259.299 68.3197 262.438H70.3197ZM78.7093 271.283C74.0354 271.04 70.3197 267.173 70.3197 262.438H68.3197C68.3197 268.243 72.8744 272.983 78.6055 273.281L78.7093 271.283ZM78.959 275.933C78.959 274.772 79.1819 273.666 79.5862 272.652L77.7286 271.911C77.2318 273.156 76.959 274.514 76.959 275.933H78.959ZM86.1672 284.638C82.0635 283.865 78.959 280.261 78.959 275.933H76.959C76.959 281.24 80.7658 285.656 85.7974 286.603L86.1672 284.638ZM86.9808 285.791C86.9808 285.74 86.9813 285.689 86.9821 285.637L84.9824 285.603C84.9814 285.666 84.9808 285.729 84.9808 285.791H86.9808ZM95.8383 294.649C90.9464 294.649 86.9808 290.683 86.9808 285.791H84.9808C84.9808 291.788 89.8419 296.649 95.8383 296.649V294.649ZM144.002 294.649H95.8383V296.649H144.002V294.649ZM152.859 285.791C152.859 290.683 148.894 294.649 144.002 294.649V296.649C149.998 296.649 154.859 291.788 154.859 285.791H152.859ZM152.859 285.666C152.859 285.707 152.859 285.749 152.859 285.791H154.859C154.859 285.74 154.859 285.689 154.858 285.638L152.859 285.666ZM152.858 285.636L152.859 285.667L154.858 285.636L154.858 285.605L152.858 285.636ZM160.882 275.933C160.882 280.261 157.777 283.866 153.673 284.638L154.043 286.603C159.075 285.657 162.882 281.241 162.882 275.933H160.882ZM160.254 272.652C160.659 273.666 160.882 274.772 160.882 275.933H162.882C162.882 274.514 162.609 273.156 162.112 271.911L160.254 272.652ZM169.52 262.438C169.52 267.173 165.805 271.04 161.131 271.283L161.235 273.281C166.966 272.983 171.52 268.242 171.52 262.438H169.52ZM166.696 255.953C168.435 257.572 169.52 259.877 169.52 262.438H171.52C171.52 259.299 170.187 256.47 168.059 254.489L166.696 255.953ZM173.84 245.657C173.84 249.805 170.987 253.289 167.136 254.251L167.62 256.191C172.341 255.013 175.84 250.745 175.84 245.657H173.84ZM168.35 237.462C171.573 238.788 173.84 241.959 173.84 245.657H175.84C175.84 241.12 173.058 237.236 169.111 235.612L168.35 237.462ZM169.52 230.871C169.52 232.767 168.926 234.522 167.913 235.961L169.548 237.112C170.791 235.346 171.52 233.192 171.52 230.871H169.52ZM161.546 222.057C166.023 222.499 169.52 226.277 169.52 230.871H171.52C171.52 225.239 167.233 220.609 161.742 220.067L161.546 222.057ZM160.882 218.901C160.882 219.57 160.808 220.219 160.668 220.844L162.62 221.28C162.791 220.514 162.882 219.717 162.882 218.901H160.882ZM153.673 210.197C157.777 210.969 160.882 214.574 160.882 218.901H162.882C162.882 213.594 159.075 209.178 154.043 208.231L153.673 210.197ZM152.859 209.043C152.859 209.095 152.859 209.146 152.858 209.197L154.858 209.231C154.859 209.168 154.859 209.106 154.859 209.043H152.859ZM144.002 200.186C148.894 200.186 152.859 204.151 152.859 209.043H154.859C154.859 203.047 149.998 198.186 144.002 198.186V200.186Z"
          fill="black"
          mask="url(#path-20-outside-1_22057_76)"
        />
        <rect x="86.4808" y="276.434" width="66.8786" height="18.7148" rx="9.35742" fill="#EA9A2C" stroke="black" />
        <rect x="78.459" y="266.576" width="82.9226" height="18.7148" rx="9.35742" fill="#EA9A2C" stroke="black" />
        <rect x="69.8197" y="253.081" width="100.201" height="18.7148" rx="9.35742" fill="#EA9A2C" stroke="black" />
        <rect
          x="0.5"
          y="-0.5"
          width="66.8786"
          height="18.7148"
          rx="9.35742"
          transform="matrix(1 0 0 -1 85.9808 217.901)"
          fill="#EA9A2C"
          stroke="black"
        />
        <rect
          x="0.5"
          y="-0.5"
          width="82.9226"
          height="18.7148"
          rx="9.35742"
          transform="matrix(1 0 0 -1 77.959 227.759)"
          fill="#EA9A2C"
          stroke="black"
        />
        <rect
          x="0.5"
          y="-0.5"
          width="100.201"
          height="18.7148"
          rx="9.35742"
          transform="matrix(1 0 0 -1 69.3197 239.728)"
          fill="#EA9A2C"
          stroke="black"
        />
        <rect x="65.5" y="236.299" width="108.84" height="18.7148" rx="9.35742" fill="#EA9A2C" stroke="black" />
        <path d="M78.0432 242.664H154.931" stroke="#EBF479" stroke-width="6" stroke-linecap="round" />
        <path d="M82.8492 260.971H150.126" stroke="#EBF479" stroke-width="6" stroke-linecap="round" />
        <path d="M82.8492 228.172H150.126" stroke="#EBF479" stroke-width="6" stroke-linecap="round" />
        <path d="M100.012 203H140.515" stroke="#EBF479" stroke-width="4" stroke-linecap="round" />
        <path d="M95.2057 214.442H144.634" stroke="#EBF479" stroke-width="6" stroke-linecap="round" />
        <path d="M95.2057 276.227H144.634" stroke="#EBF479" stroke-width="6" stroke-linecap="round" />
        <ellipse cx="165.229" cy="242.665" rx="3.4325" ry="3.81388" fill="#EBF479" />
        <ellipse cx="159.737" cy="260.972" rx="3.4325" ry="3.81388" fill="#EBF479" />
        <ellipse cx="159.737" cy="228.172" rx="3.4325" ry="3.81388" fill="#EBF479" />
        <ellipse cx="152.529" cy="214.824" rx="3.08925" ry="3.4325" fill="#EBF479" />
        <ellipse cx="152.529" cy="276.609" rx="3.08925" ry="3.4325" fill="#EBF479" />
        <rect
          x="86"
          y="676"
          width="131"
          height="131"
          rx="31"
          fill="#B2E946"
          stroke="black"
          stroke-width="2"
          stroke-linejoin="round"
        />
        <rect x="87" y="687.75" width="127.838" height="118.25" rx="30" fill="#9ACA3B" />
        <path d="M133 731H151" stroke="#7EA82B" stroke-width="6" stroke-linecap="round" />
        <path d="M118 719H136" stroke="#7EA82B" stroke-width="6" stroke-linecap="round" />
        <rect
          x="30"
          y="780"
          width="100"
          height="100"
          rx="31"
          fill="#B2E946"
          stroke="black"
          stroke-width="2"
          stroke-linejoin="round"
        />
        <rect x="31" y="789.167" width="97.1171" height="89.8333" rx="30" fill="#9ACA3B" />
        <path d="M91 812H109" stroke="#7EA82B" stroke-width="6" stroke-linecap="round" />
        <path d="M51 847H69" stroke="#7EA82B" stroke-width="6" stroke-linecap="round" />
        <rect
          x="149"
          y="718"
          width="174"
          height="112"
          rx="30"
          fill="#527213"
          stroke="black"
          stroke-width="2"
          stroke-linejoin="round"
        />
        <path d="M183 794H201" stroke="#7EA82B" stroke-width="6" stroke-linecap="round" />
        <path d="M168 782H186" stroke="#7EA82B" stroke-width="6" stroke-linecap="round" />
        <path
          d="M108.938 521.5C115.337 481.9 140.604 483.667 150.937 477C165.604 481.333 191.537 493.6 177.938 508C160.938 526 150.937 569 137.438 569C123.938 569 111.937 568 98.9373 569C85.9373 570 90.4373 562 101.437 555.5C110.237 550.3 109.104 522.333 108.938 521.5Z"
          fill="#725D41"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M111.018 432.5C127.818 432.5 156.684 404.167 169.018 390L173.018 440C159.518 447.5 126.635 467.007 111.018 460.5C93.0177 453 51.5177 441 66.0177 432.5C74.5177 427.517 90.0177 432.5 111.018 432.5Z"
          fill="#725D41"
        />
        <path
          d="M169.018 390C156.684 404.167 127.818 432.5 111.018 432.5C90.0177 432.5 74.5177 427.517 66.0177 432.5C51.5177 441 93.0177 453 111.018 460.5C126.635 467.007 159.518 447.5 173.018 440"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <rect
          x="45"
          y="439"
          width="86"
          height="86"
          rx="31"
          fill="#B2E946"
          stroke="black"
          stroke-width="2"
          stroke-linejoin="round"
        />
        <rect x="46" y="447" width="83.2432" height="77" rx="30" fill="#9ACA3B" />
        <path d="M72.5714 476H88" stroke="#7EA82B" stroke-width="6" stroke-linecap="round" />
        <path d="M81.1428 491.429H96.5714" stroke="#7EA82B" stroke-width="6" stroke-linecap="round" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M94.5 514.366C98.366 514.366 101.5 517.5 101.5 521.366V537C101.5 538.656 102.843 540 104.5 540H226C229.866 540 233 543.134 233 547C233 550.866 229.866 554 226 554H104.5C95.1112 554 87.5 546.388 87.5 537V521.366C87.5 517.5 90.634 514.366 94.5 514.366Z"
          fill="#906925"
          stroke="black"
          stroke-linecap="round"
        />
        {/*#region Bee Left fly Trajectory*/}
        <path
          d="M139 246C120.333 260.167 77.6 288.9 56 290.5C34.4 292.1 47 274.833 56 266"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-dasharray="2 2"
        />
        {/*#endregion*/}
        {/*#region Bee Left*/}
        <path
          d="M55.909 243.55C52.7309 244.198 52.6959 247.478 53.1543 249.727L54.8125 249.795C54.8125 249.795 56.1781 249.11 56.8914 248.368C59.0462 246.126 57.8359 243.157 55.909 243.55Z"
          fill="white"
          stroke="black"
          stroke-linecap="round"
        />
        <path
          d="M49.1037 254.472C48.7893 252.93 49.5433 251.706 49.9596 251.287C52.8501 250.697 55.5442 249.145 56.3113 247.985C57.0783 246.825 61.1289 247.002 61.3347 250.473C61.5406 253.943 57.4994 256.273 53.6454 257.059C50.5621 257.687 49.9783 256.301 49.3001 255.435L47.7566 255.249L49.1037 254.472Z"
          fill="#FEEF48"
          stroke="black"
          stroke-linecap="round"
        />
        <path
          d="M49.1037 254.472C48.7893 252.931 49.4778 251.385 50.923 251.09C50.923 251.09 50.0903 251.928 50.549 254.177C51.2435 257.584 53.6454 257.059 53.6454 257.059C53.6454 257.059 50.3712 258.228 49.3001 255.436L47.7566 255.249L49.1037 254.472Z"
          fill="black"
        />
        <path
          d="M52.3681 250.796C52.5022 252.274 52.6547 255.153 54.5107 256.38"
          stroke="black"
          stroke-linecap="round"
        />
        <path
          d="M55.0859 249.238C55.22 250.716 56.6479 254.439 58.9807 254.465"
          stroke="black"
          stroke-linecap="round"
        />
        <path
          d="M49.8962 245.373C52.8223 243.974 54.4706 248.12 54.929 250.368L53.4301 251.081C53.4301 251.081 51.9052 250.985 50.9582 250.581C48.0977 249.362 46.2385 247.123 49.8962 245.373Z"
          fill="white"
          stroke="black"
          stroke-linecap="round"
        />
        <path
          d="M56.9202 249.366C56.468 248.789 55.8135 247.383 56.8126 246.377"
          stroke="black"
          stroke-linecap="round"
        />
        <path d="M59.3 247.877C59.1952 247.363 59.1627 246.219 59.8706 245.753" stroke="black" stroke-linecap="round" />
        {/*#endregion*/}
        {/*#region Bee Right*/}
        <path
          d="M179.456 209.794C182.634 210.442 182.669 213.722 182.21 215.971L180.552 216.039C180.552 216.039 179.187 215.354 178.473 214.612C176.318 212.37 177.529 209.401 179.456 209.794Z"
          fill="white"
          stroke="black"
          stroke-linecap="round"
        />
        <path
          d="M186.261 220.716C186.575 219.174 185.821 217.95 185.405 217.531C182.515 216.941 179.82 215.388 179.053 214.228C178.286 213.068 174.236 213.246 174.03 216.717C173.824 220.187 177.865 222.517 181.719 223.302C184.803 223.931 185.386 222.545 186.065 221.679L187.608 221.492L186.261 220.716Z"
          fill="#FEEF48"
          stroke="black"
          stroke-linecap="round"
        />
        <path
          d="M186.261 220.716C186.575 219.174 185.887 217.629 184.442 217.334C184.442 217.334 185.274 218.172 184.816 220.421C184.121 223.828 181.719 223.303 181.719 223.303C181.719 223.303 184.993 224.472 186.065 221.679L187.608 221.493L186.261 220.716Z"
          fill="black"
        />
        <path
          d="M182.997 217.039C182.862 218.518 182.71 221.397 180.854 222.624"
          stroke="black"
          stroke-linecap="round"
        />
        <path
          d="M180.279 215.482C180.145 216.96 178.717 220.683 176.384 220.709"
          stroke="black"
          stroke-linecap="round"
        />
        <path
          d="M185.468 211.617C182.542 210.218 180.894 214.364 180.436 216.612L181.935 217.325C181.935 217.325 183.459 217.229 184.406 216.825C187.267 215.606 189.126 213.366 185.468 211.617Z"
          fill="white"
          stroke="black"
          stroke-linecap="round"
        />
        <path
          d="M178.444 215.61C178.897 215.033 179.551 213.627 178.552 212.621"
          stroke="black"
          stroke-linecap="round"
        />
        <path
          d="M176.065 214.121C176.169 213.607 176.202 212.463 175.494 211.997"
          stroke="black"
          stroke-linecap="round"
        />
        {/*#endregion*/}
        <path
          d="M198.565 333.19C194.888 332.279 191.111 334.723 189.084 337.148C188.41 337.954 188.731 339.123 189.653 339.628C203.547 347.24 203.953 334.525 198.565 333.19Z"
          fill="#725D41"
          stroke="black"
        />
        <path
          d="M208.899 339.117C205.657 335.473 199.547 337.013 195.702 338.767C194.698 339.225 194.372 340.465 194.979 341.386C204.186 355.342 213.483 344.269 208.899 339.117Z"
          fill="#725D41"
          stroke="black"
        />
        <path
          d="M162.892 326.788C157.466 326.38 148.233 319.591 144.294 316.247C130.561 324.958 143.076 343.273 152.149 353.787C156.223 358.507 152.149 383.195 152.149 383.195C118.956 467.5 122 478 131 504C96.5001 536 129.956 567.195 118.956 567.695C107.956 568.195 100.456 573.695 116.456 579.695C132.456 585.695 145.456 608.695 157.956 582.195C170.456 555.695 203.456 551.195 223.456 543.195C274.956 522.593 207.262 387.203 207.456 373.695C207.857 345.764 202.492 346.632 190.27 336.257C170.831 319.754 169.673 327.298 162.892 326.788Z"
          fill="#725D41"
        />
        <path
          d="M131 504C122 478 118.956 467.5 152.149 383.195C152.149 383.195 156.223 358.507 152.149 353.787C143.076 343.273 130.561 324.958 144.294 316.247C148.233 319.591 157.466 326.38 162.892 326.788C169.673 327.298 170.831 319.754 190.27 336.257C202.492 346.632 207.857 345.764 207.456 373.695C207.262 387.203 274.956 522.593 223.456 543.195C203.456 551.195 170.456 555.695 157.956 582.195C145.456 608.695 132.456 585.695 116.456 579.695C100.456 573.695 107.956 568.195 118.956 567.695C129.956 567.195 96.5001 536 131 504ZM131 504C133.603 502.167 148 494.5 152.149 489.5"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M250.552 522.717C252.377 528.913 243.418 530.229 237.693 530.022C236.354 529.973 235.601 528.568 236.179 527.36L239.108 521.241C239.23 520.986 239.402 520.76 239.623 520.585C242.606 518.225 248.482 515.686 250.552 522.717Z"
          fill="#725D41"
          stroke="black"
        />
        <ellipse cx="168" cy="332" rx="3" ry="2" fill="black" />
        <path
          d="M160.612 326.331C155.703 324.844 149.179 320.216 145.427 317.185C144.746 316.635 143.778 316.561 143.078 317.087C135.105 323.069 137.737 331.827 142.971 341.188C143.257 341.699 143.754 342.062 144.336 342.127C149.417 342.686 158.583 340.696 162.277 329.044C162.647 327.875 161.785 326.687 160.612 326.331Z"
          fill="#B5966E"
          stroke="black"
        />
        <path d="M144 340.951C146.167 341.951 151.7 343.351 156.5 340.951" stroke="black" stroke-linecap="round" />
        {/*#region Tongue*/}
        <path
          d="M153 335.918C151.8 338.718 149.5 341.272 148 341.939C148.539 342.074 150.302 342.575 153.5 341.951C154.253 341.805 154.585 341.68 155.5 341.451C161.5 339.951 154.5 332.418 153 335.918Z"
          fill="#FF7B91"
        />
        {/*#endregion*/}
        <path
          d="M153.5 341.951C154.253 341.805 154.585 341.68 155.5 341.451C161.5 339.951 154.5 332.418 153 335.918C151.8 338.718 149.5 341.272 148 341.939C148.539 342.074 150.302 342.575 153.5 341.951ZM153.5 341.951C154.167 341.258 155.5 339.118 155.5 337.918"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M140.942 316.287C139.869 317.55 140.365 319.733 142.049 321.163C143.734 322.592 144.062 321.11 145.135 319.847C146.207 318.583 147.617 318.018 145.932 316.589C144.248 315.159 142.014 315.024 140.942 316.287Z"
          fill="black"
        />
        {/*#region Arm*/}
        <motion.path
          d="M122.5 313.551C132.1 330.751 166.5 365.333 179 379C196.5 406.449 176.5 433.5 160.5 429.5C140.5 424.5 108.5 332.551 105 320.551C101.5 308.551 88.0001 313.551 88.0001 305.051C88.0001 296.551 110.5 292.051 122.5 313.551Z"
          fill="#725D41"
          animate={{
            rotate: [0, 10, 0, 10, 0],
          }}
          style={{
            transformOrigin: 'right center'
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
            repeatDelay: 1,
          }}
        />
        <motion.path
          d="M179 379C166.5 365.333 132.1 330.751 122.5 313.551C110.5 292.051 88.0001 296.551 88.0001 305.051C88.0001 313.551 101.5 308.551 105 320.551C108.5 332.551 140.5 424.5 160.5 429.5"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
          animate={{
            rotate: [0, 10, 0, 10, 0],
          }}
          style={{
            transformOrigin: 'right center'
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
            repeatDelay: 1,
          }}
        />
        {/*#endregion*/}
      </motion.svg>
    </div>
  )
}

const BearTown = function () {
  return (
    <div className="absolute bottom-[389px] left-1/2 translate-x-[-149px] flex flex-col items-center">
      <BearCircleSvg />
      {/* @ts-ignore */}
      <div
        className="mt-[-42px] text-[90px] text-[#9F9EFF] font-CherryBomb leading-[90%]"
        // @ts-ignore
        style={{ "-webkit-text-stroke-width": 6, "-webkit-text-stroke-color": "#000" }}
      >BERA
      </div>
      {/* @ts-ignore */}
      <div
        className="mt-[-13px] text-[90px] text-[#EBF479] font-CherryBomb leading-[90%]"
        // @ts-ignore
        style={{ "-webkit-text-stroke-width": 6, "-webkit-text-stroke-color": "#000" }}
      >TOWN
      </div>
    </div>
  )
}
const HomeBear = function () {
  return (
    <div className="absolute w-[360px] left-1/2 bottom-[32px] translate-x-[-168px] z-10">
      <img src='/images/background/bear.gif' />
    </div>
  )
}

const BrigeBear = function () {
  return (
    <div className="absolute w-[360px] left-1/2 bottom-[32px] translate-x-[-676px] z-10">
      <img src='/images/background/bear.gif' />
    </div>
  )
}

const Flowers = function () {
  return (
    <div className="absolute right-0 bottom-0 z-10">
      <FlowersSvg />


    </div>
  )
}

const DashboardFlowers = function () {
  return (
    <div className="absolute left-0 bottom-0 z-10">
      <DashboardFlowersSvg />
    </div>
  )
}
const DashboardBear = function () {
  return (
    <div className="absolute right-0 bottom-[31px] z-10">
      <DashboardBearSvg />
    </div>
  )
}

const Ground = function () {
  return (
    <div className="absolute bottom-0 left-0 w-full h-[233px] bg-[#B6DF5D] border-t border-black" />
  )
}

const DashboardGroud = function () {
  return (
    <div className="absolute bottom-0 left-0 w-full">
      <HillsideSvg className="absolute left-0 bottom-[186px]" />
      <GrassSvg className="absolute right-0 bottom-[220px]" />
      <div className="absolute left-0 bottom-0 w-full h-[233px] bg-[#B6DF5D]" />
    </div>
  )
}

const BridgeGroud = function () {
  return (
    <div className="absolute left-0 bottom-0 w-full">
      <BridgeGroudSvg className="relative mx-auto z-[5]" />
      <div className="absolute bottom-[154px] left-[-21px] right-1/2 rounded-[8px] border border-black bg-[#B6DF5D] h-[80px]" />
      <div className="absolute bottom-[-142px] left-0 right-1/2 bg-[#A7CC55] h-[297px] border-t border-black " />
      <div className="absolute bottom-[154px] right-[-21px] left-1/2 rounded-[8px] border border-black bg-[#B6DF5D] h-[80px]" />
      <div className="absolute bottom-[-142px] right-0 left-1/2 bg-[#A7CC55] h-[297px] border-t border-black " />
    </div>
  )
}


type PropsType = {
  type: "home" | "dashboard" | "bridge" | "dapps" | "dapp";
  children: React.ReactNode
}

export default memo(function BearBackground({ type, children }: PropsType) {
  return (
    <div className="relative" style={{ height: 'calc(100dvh - 68px)', minHeight: 899, overflow: "hidden" }}>
      {
        type === "home" ? (
          <>
            <Clouds />
            <BearTown />
            <Flowers />
            <HomeBear />
            <Ground />
          </>
        ) : type === "dashboard" ? (
          <>
            <Clouds />
            <DashboardFlowers />
            <DashboardBear />
            <DashboardGroud />
          </>
        ) : type === "bridge" ? (
          <>
            <Clouds />
            <BrigeBear />
            <BridgeGroud />
          </>
        ) : type === "dapps" ? (
          <>
            <Clouds />
            <Flowers />
            <Ground />
            <HatBearSvg className="absolute  left-[86px] bottom-[186px]" />
          </>
        ) : type === "dapp" ? (
          <>
            <DappClouds />
            <LeftTree />
            <RightTree />
          </>
        ) : (
          <></>
        )
      }
      {children}
    </div>
  );
});
