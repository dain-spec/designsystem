import { forwardRef, useEffect, useRef } from 'react'
import lottie from 'lottie-web'

// 색상 편집과 Figma SVG 복사를 위해 canvas가 아닌 SVG 렌더러로 재생합니다.
const LottieSvg = forwardRef<HTMLDivElement, { data: object; className?: string }>(function LottieSvg(
  { data, className },
  outerRef,
) {
  const inner = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!inner.current) return
    const anim = lottie.loadAnimation({
      container: inner.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: data,
    })
    return () => anim.destroy()
  }, [data])
  return (
    <div
      ref={(el) => {
        inner.current = el
        if (typeof outerRef === 'function') outerRef(el)
        else if (outerRef) outerRef.current = el
      }}
      className={className}
    />
  )
})

export default LottieSvg
