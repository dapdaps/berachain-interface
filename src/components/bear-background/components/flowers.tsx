import { motion } from 'framer-motion';

function Flowers() {
  return (
    <div className='absolute right-0 bottom-0 z-10'>
      {/* <FlowersSvg /> */}
      <svg
        width='335'
        height='185'
        viewBox='0 0 335 185'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M71.0018 241.451C25.8703 236.743 24.3967 224.951 17.5158 210.571C8.22318 175.125 29.8366 162.933 57.5919 167.455C85.3473 171.977 92.2993 142.404 116.789 147.801C136.38 152.119 142.689 169.349 143.395 177.425C159.366 182.965 186.996 201.678 169.74 232.204C148.17 270.361 127.416 247.336 71.0018 241.451Z'
          fill='#F6C5C9'
          stroke='black'
        />
        <path
          d='M52.0949 226.985C33.6586 229.591 28.5068 211.526 28.2355 202.167C31.0677 187.699 36.7526 176.258 67.4821 178.817C98.2115 181.375 100.154 166.854 134.053 179.064C167.952 191.274 154.767 244.394 131.736 244.44C108.705 244.485 114.315 216.438 96.795 210.924C79.2745 205.409 75.1404 223.727 52.0949 226.985Z'
          fill='#EC99A3'
        />
        <path
          d='M116.339 138.193C109.539 154.993 119.172 184.193 124.839 196.693C133.172 198.859 150.539 198.593 153.339 180.193C156.839 157.193 145.339 157.693 143.839 138.193C142.339 118.693 124.839 117.193 116.339 138.193Z'
          fill='#407300'
          stroke='black'
        />
        <path
          d='M84.5208 120.352L70.3724 138.891C69.7444 139.714 70.6275 140.832 71.5735 140.412L78.2397 137.449C78.6423 137.27 79.0554 137.678 78.8819 138.083C78.7118 138.479 79.1064 138.884 79.5072 138.723L85.4925 136.329C85.7155 136.24 85.9119 136.505 85.7619 136.692C85.6032 136.891 85.8303 137.164 86.0544 137.045L89.2241 135.354C89.5449 135.183 89.9432 135.283 90.1449 135.586C90.3105 135.834 90.6074 135.953 90.897 135.881C93.6124 135.199 107.041 131.804 107.474 131.263C108.426 130.072 112.791 125.23 115.692 121.341C116.315 120.506 115.459 119.69 114.603 120.284L104.316 127.422C103.597 127.921 102.629 127.321 102.757 126.455L103.747 119.719C103.859 118.957 103.108 118.37 102.412 118.702C97.957 120.831 91.7235 124.938 87.9095 127.605C87.241 128.073 86.3158 127.597 86.3158 126.781V120.959C86.3158 120.002 85.1013 119.591 84.5208 120.352Z'
          fill='#16643C'
        />
        <path
          d='M68 142L84.5208 120.352C85.1013 119.591 86.3158 120.002 86.3158 120.959V126.781C86.3158 127.597 87.241 128.073 87.9095 127.605C91.7235 124.938 97.957 120.831 102.412 118.702C103.108 118.37 103.859 118.957 103.747 119.719L102.757 126.455C102.629 127.321 103.597 127.921 104.316 127.422L114.603 120.284C115.459 119.69 116.315 120.506 115.692 121.341C112.791 125.23 108.426 130.072 107.474 131.263'
          stroke='black'
          stroke-linejoin='round'
        />
      </svg>

      <motion.svg
        animate={{
          rotate: [0, 10, 0, 10, 0]
        }}
        transition={{
          duration: 10,
          ease: 'linear',
          repeat: Infinity
        }}
        style={{
          transformOrigin: '80px bottom'
        }}
        className='absolute right-0 bottom-0'
        width='172'
        height='185'
        viewBox='0 0 172 185'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M171.532 176.282C163.092 195.866 145.552 209.148 137.837 213.341C142.561 199.142 155.564 165.633 169.786 145.193C187.565 119.644 217.759 114.631 219.051 125.839C220.343 137.046 182.083 151.802 171.532 176.282Z'
          fill='#14653C'
          stroke='black'
        />
        <path
          d='M85.0989 161.048C111.512 167.981 129.072 183.564 134.551 190.489C133.447 170.826 111.202 153.007 93.0764 149.422C74.9506 145.837 52.0825 152.382 85.0989 161.048Z'
          fill='#14653C'
          stroke='black'
        />
        <path
          d='M133.781 201.915C131.108 154.309 118.528 127.158 112.573 119.533C112.91 109.786 116.732 96.7478 129.325 122.572C145.067 154.852 137.122 261.422 133.781 201.915Z'
          fill='#14653C'
          stroke='black'
        />
        <path
          d='M102.505 14.3051C154.505 -8.89487 163.505 2.99512 180.005 14.3051C212.343 46.9952 196.505 73.8053 163.505 86.3053C130.505 98.8053 141.505 135.305 111.505 144.805C87.505 152.405 69.8383 137.639 64.005 129.305C43.1717 133.305 1.405 130.305 1.005 86.3053C0.505005 31.3053 37.505 43.3051 102.505 14.3051Z'
          fill='#F08A95'
          stroke='black'
        />
        <path
          d='M132.128 18.1637C150.528 3.76374 167.461 20.1637 173.628 30.1637C179.628 47.6639 180.628 63.6636 145.628 80.1636C110.628 96.6636 117.628 113.664 73.1282 121.664C28.6282 129.664 9.62816 63.6636 34.6282 49.1636C59.6282 34.6636 71.1282 68.6636 93.6282 63.6636C116.128 58.6636 109.128 36.1637 132.128 18.1637Z'
          fill='#E36974'
        />
        <path
          d='M75.8435 54.3453C59.8435 68.8453 73.3435 76.8453 91.8435 71.3453C100.422 68.7948 107.624 63.3212 112.843 58.0016C104.843 44.658 91.8435 39.8453 75.8435 54.3453Z'
          fill='#EBF479'
        />
        <path
          d='M120.843 47.8453C119.372 50.3674 116.629 54.144 112.843 58.0016M112.843 58.0016C107.624 63.3212 100.422 68.7948 91.8435 71.3453C73.3435 76.8453 59.8435 68.8453 75.8435 54.3453C91.8435 39.8453 104.843 44.658 112.843 58.0016Z'
          stroke='black'
        />
      </motion.svg>

      <motion.svg
        animate={{
          rotate: [0, 10, 0, 10, 0]
        }}
        transition={{
          duration: 10,
          ease: 'linear',
          repeat: Infinity
        }}
        style={{
          transformOrigin: '30px bottom'
        }}
        className='absolute bottom-[40px] right-[227px]'
        width='105'
        height='99'
        viewBox='0 0 105 99'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M25.413 77.7593C30.0379 87.009 38.9022 92.9613 42.7562 94.7813C40.0798 88.0367 32.8642 72.171 25.413 62.6643C16.0991 50.7811 1.32532 49.1752 1.00415 54.6351C0.682983 60.095 19.632 66.1972 25.413 77.7593Z'
          fill='#14653C'
          stroke='black'
        />
        <path
          d='M66.8438 68.1246C54.2539 72.2356 46.1819 80.3291 43.7196 83.8619C43.7196 74.2269 53.997 64.9129 62.6686 62.6647C71.3402 60.4165 82.5811 62.9859 66.8438 68.1246Z'
          fill='#14653C'
          stroke='black'
        />
        <path
          d='M44.3621 89.3217C44.3621 66.1975 49.7149 52.7083 52.3913 48.8543C51.9631 44.1438 49.7577 37.9345 44.3621 50.7813C37.6175 66.8398 44.3621 118.227 44.3621 89.3217Z'
          fill='#14653C'
          stroke='black'
        />
        <path
          d='M14.4933 4.42765C27.5971 -4.05122 58.4936 5.17705 72.3039 10.851C119.675 20.486 114.056 52.2821 54.9607 51.6397C-4.1345 50.9974 -1.88631 15.0262 14.4933 4.42765Z'
          fill='#F0775C'
          stroke='black'
        />
        <path
          d='M23.6442 11.8281C33.1166 5.69892 55.451 12.3698 65.4342 16.4715C99.6778 23.4364 95.616 46.4211 52.8972 45.9567C10.1785 45.4924 11.8036 19.4896 23.6442 11.8281Z'
          fill='#E35B4B'
        />
        <path
          d='M61.3439 32.6077C65.7118 30.5523 58.2393 26.1844 53.957 24.2573C48.4972 22.3303 43.0372 20.4033 42.0737 25.2208C41.1102 30.0384 55.884 35.1771 61.3439 32.6077Z'
          fill='#F3AD11'
          stroke='black'
        />
      </motion.svg>

      <motion.svg
        className='absolute bottom-0 right-[102px]'
        xmlns='http://www.w3.org/2000/svg'
        width='83'
        height='72'
        viewBox='0 0 83 72'
        fill='none'
      >
        <path
          d='M34.6847 56.6221C26.2442 76.206 8.70457 89.4885 0.989837 93.6818C5.71345 79.4822 18.7163 45.9732 32.939 25.5337C50.7172 -0.0155732 80.9115 -5.0288 82.2034 6.17884C83.4952 17.3865 45.2353 32.1422 34.6847 56.6221Z'
          fill='#14653C'
          stroke='black'
        />
      </motion.svg>
    </div>
  );
}

export default Flowers;