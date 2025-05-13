import { memo } from "react";

export default memo(function CustomImage({
  alt,
  src,
  className,
  errorImage
}: {
  alt: string
  src: string
  className: string
  errorImage: string
}) {

  return (
    <img
      onError={(event) => {
        const target = event.currentTarget
        const errorImage = target.getAttribute("errorImage")
        target.setAttribute("src", errorImage)
      }}
      alt={alt}
      src={src}
      className={className}
      errorImage={errorImage}
    />
  )

})
