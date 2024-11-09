'use client';

import ReactDOM from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDebounceFn } from 'ahooks';

const Drawer = (props: Props) => {
  const {
    visible,
    style,
    className,
    overlayStyle,
    overlayClassName,
    children,
    direction = DrawerDirection.Bottom,
    size,
    onClose,
  } = props;

  const drawerRef = useRef<any>(null);
  const sizeStyles = formatSize(direction, size);
  const drawerAnimations = formatDrawerAnimations(direction, sizeStyles);

  const [visibleInner, setVisibleInner] = useState(visible);

  const { run: handleCloseDebounce } = useDebounceFn(() => {
    onClose?.();
  }, { wait: 300 });

  const handleClose = () => {
    setVisibleInner(false);
    handleCloseDebounce();
  };

  const handleMask = (e: any) => {
    if (drawerRef.current.contains(e.target)) {
      return;
    }
    handleClose();
  };

  useEffect(() => {
    setVisibleInner(visible);
  }, [visible]);


  return ReactDOM.createPortal((
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${overlayClassName}`}
          style={overlayStyle}
          onClick={handleMask}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={drawerRef}
            className={`fixed bg-white z-50 ${className}`}
            style={{
              ...style,
              ...DrawerDirectionStyles[direction],
              ...sizeStyles,
            }}
            initial={drawerAnimations.hidden}
            animate={drawerAnimations.visible}
            exit={drawerAnimations.hidden}
          >
            {children}
          </motion.div>
        </motion.div>)
}
    </AnimatePresence>
  ), document.body);
};

// 

export default Drawer;

export enum DrawerDirection {
  Bottom,
  Left,
  Right,
  Top,
}

const DrawerDirectionStyles: Record<DrawerDirection, React.CSSProperties> = {
  [DrawerDirection.Bottom]: {
    left: 0,
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  [DrawerDirection.Left]: {
    left: 0,
    top: 0,
    height: '100%',
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
  },
  [DrawerDirection.Right]: {
    right: 0,
    top: 0,
    height: '100%',
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
  },
  [DrawerDirection.Top]: {
    left: 0,
    top: 0,
    width: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
};

function formatSize(direction: DrawerDirection, size?: number | string): React.CSSProperties {
  if ([DrawerDirection.Bottom, DrawerDirection.Top].includes(direction)) {
    if (!size) {
      return { height: '80vh' };
    }
    return {
      height: size,
    };
  }
  if (!size) {
    return { width: '80vw' };
  }
  return {
    width: size,
  };
}

function formatDrawerAnimations(direction: DrawerDirection, sizeStyles: React.CSSProperties) {
  const animations: any = { visible: {}, hidden: {} };
  switch (direction) {
    case DrawerDirection.Bottom:
      animations.visible = { y: 0 };
      animations.hidden = { y: sizeStyles.height };
      break;
    case DrawerDirection.Left:
      animations.visible = { x: 0 };
      animations.hidden = { x: `-${sizeStyles.width}` };
      break;
    case DrawerDirection.Right:
      animations.visible = { x: 0 };
      animations.hidden = { x: sizeStyles.width };
      break;
    case DrawerDirection.Top:
      animations.visible = { y: 0 };
      animations.hidden = { y: `-${sizeStyles.height}` };
      break;
    default:
      break;
  }
  return animations;
}

interface Props {
  visible?: boolean;
  style?: React.CSSProperties;
  className?: string;
  overlayStyle?: React.CSSProperties;
  overlayClassName?: string;
  children: React.ReactNode;
  direction?: DrawerDirection;
  // when direction = DrawerDirection.Bottom | DrawerDirection.Top, size refers to height
  // when direction = DrawerDirection.Left | DrawerDirection.Right, size refers to width
  size?: number | string;

  onClose?(): void;
}
