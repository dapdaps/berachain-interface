export enum MaskPlacement {
  TopLeft,
  Top,
  TopRight,
  RightTop,
  Right,
  RightBottom,
  BottomRight,
  Bottom,
  BottomLeft,
  LeftBottom,
  Left,
  LeftTop,
  Center
}

export const getMaskBoundRect = (element: HTMLElement, container: HTMLElement) => {
    if (!element) {
      return {};
    }
  
    const { height, width, left, top } = element.getBoundingClientRect();
    const elementTopWithScroll = container.scrollTop + top;
    const elementLeftWithScroll = container.scrollLeft + left;
  
    return {
      width: container.scrollWidth,
      height: container.scrollHeight,
      top: elementTopWithScroll,
      left: elementLeftWithScroll,
      elementWidth: width,
      elementHeight: height,
      radius: 10
    };
  };

const HIGHLIGHT_PADDING = 5; // 高亮区域的padding
const SPACING = 10; // 内容和高亮区域之间的间距

export const getPositionStyle = (
  placement: MaskPlacement,
  top: number,
  left: number,
  elementWidth: number,
  elementHeight: number,
  contentWidth: number,
  contentHeight: number
) => {
  const highlightWidth = elementWidth + (HIGHLIGHT_PADDING * 2);
  const highlightHeight = elementHeight + (HIGHLIGHT_PADDING * 2);
  const highlightLeft = left - HIGHLIGHT_PADDING;
  const highlightTop = top - HIGHLIGHT_PADDING;

  switch (placement) {
    case MaskPlacement.TopLeft:
      return { 
        top: highlightTop - contentHeight - SPACING,
        left: highlightLeft - contentWidth - SPACING
      };
    case MaskPlacement.Top:
      return { 
        top: highlightTop - contentHeight - SPACING,
        left: highlightLeft + (highlightWidth / 2) - (contentWidth / 2)
      };
    case MaskPlacement.TopRight:
      return { 
        top: highlightTop - contentHeight - SPACING,
        left: highlightLeft + highlightWidth + SPACING
      };
    case MaskPlacement.RightTop:
      return { 
        top: highlightTop - SPACING,
        left: highlightLeft + highlightWidth + SPACING
      };
    case MaskPlacement.Right:
      return { 
        top: highlightTop + (highlightHeight / 2) - (contentHeight / 2),
        left: highlightLeft + highlightWidth + SPACING
      };
    case MaskPlacement.RightBottom:
      return { 
        top: highlightTop + highlightHeight + SPACING - contentHeight,
        left: highlightLeft + highlightWidth + SPACING
      };
    case MaskPlacement.BottomRight:
      return { 
        top: highlightTop + highlightHeight + SPACING,
        left: highlightLeft + highlightWidth + SPACING
      };
    case MaskPlacement.Bottom:
      return { 
        top: highlightTop + highlightHeight + SPACING,
        left: highlightLeft + (highlightWidth / 2) - (contentWidth / 2)
      };
    case MaskPlacement.BottomLeft:
      return { 
        top: highlightTop + highlightHeight + SPACING,
        left: highlightLeft - contentWidth
      };
    case MaskPlacement.LeftBottom:
      return { 
        top: highlightTop + highlightHeight + SPACING - contentHeight,
        left: highlightLeft - contentWidth - SPACING 
      };
    case MaskPlacement.Left:
      return { 
        top: highlightTop + (highlightHeight / 2) - (contentHeight / 2),
        left: highlightLeft - elementWidth - contentWidth
      };
    case MaskPlacement.LeftTop:
      return { 
        top: highlightTop - SPACING,
        left: highlightLeft - contentWidth - SPACING
      };
    case MaskPlacement.Center:
      return { 
        top: highlightTop + (highlightHeight / 2) - (contentHeight / 2),
        left: highlightLeft + (highlightWidth / 2) - (contentWidth / 2)
      };
    default:
      return { 
        top: highlightTop + highlightHeight + SPACING,
        left: highlightLeft + highlightWidth + SPACING
      };
  }
};
