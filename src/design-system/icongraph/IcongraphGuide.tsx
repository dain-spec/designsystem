import type { ReactNode } from 'react'
import { assetUrl } from './assetUrl'

interface GuideSection {
  title: string
  badge?: string
  description: string
  bullets?: ReactNode[]
  image: { src: string; alt: string }
  extra?: { title: string; badge: string; description: string; image: { src: string; alt: string } }
}

const img = (n: string) => assetUrl(`/icongraph/guide/${n}.png`)

const sections: GuideSection[] = [
  {
    title: 'Categories',
    description:
      '아이콘은 서비스 내 기능과 정보를 직관적으로 전달하기 위한 그래픽 요소입니다. 모노크롬 아이콘은 다양한 시각적 표현과 폰트의 맥락에 맞춰, Line과 Fill 두 가지 타입으로 제공됩니다.',
    image: { src: img('01-categories'), alt: 'Monochrome/Multicolor 카테고리 예시' },
  },
  {
    title: 'Grid',
    description: 'Grid는 24x24px을 기본으로 사용하며, 크기 및 목적에 따라 조정될 수 있습니다.',
    image: { src: img('02-grid'), alt: '24x24 그리드' },
  },
  {
    title: 'Padding',
    description: 'Grid에는 상하좌우 2px의 Padding이 포함됩니다. 아이콘은 padding을 제외한 영역 안에 그리도록 합니다.',
    image: { src: img('03-padding'), alt: 'Live Area와 Padding' },
  },
  {
    title: 'Key shape',
    description:
      'Key Shape은 각 아이콘의 기본 틀을 정의합니다. 비슷한 비율의 아이콘에 일관성을 줄 수 있습니다. 아래의 가이드를 따라 형태를 잡습니다.',
    image: { src: img('04-keyshape'), alt: 'Square, Vertical/Horizontal Rectangle, Circle 키 셰이프' },
  },
  {
    title: 'Radius',
    description: '기본 도형인 컨테이너는 3.5px로 적용하고 그 외 디테일한 형태들은 조정하여 사용할 수 있습니다.',
    image: { src: img('05-radius'), alt: 'Line/Fill/MultiColor 타입별 코너 radius' },
  },
  {
    title: '두께',
    badge: 'Monochrome',
    description: '24 사이즈의 아이콘 기본 두께는 1.5px이나 1 또는 2px를 적용할 수 있으며 획의 정렬은 Center로 합니다.',
    image: { src: img('06-thickness-mono'), alt: 'Monochrome 두께 1.5 / 2 / 1px' },
    extra: {
      title: '두께',
      badge: 'MultiColor',
      description:
        '내부에 개체의 형태를 묘사할 경우 최소 2px 라인 두께를 사용합니다. 단, 디테일 표현 및 형태 구분을 위해 필요한 경우 최소 2px 미만의 라인을 예외적으로 허용합니다.',
      image: { src: img('07-thickness-multi'), alt: 'MultiColor 두께 예시' },
    },
  },
  {
    title: '조합',
    description:
      '두 개의 의미 요소를 결합하여 표현할 때는 기본 아이콘에 보조 아이콘을 우측 하단에 위치합니다. 단, 아이콘의 형태와 의미 전달을 위해 필요한 경우 보조 아이콘의 위치와 크기를 예외적으로 조정할 수 있습니다.',
    image: { src: img('08-composition'), alt: '기본 아이콘과 보조 아이콘 조합 예시' },
  },
  {
    title: 'Color',
    badge: 'MultiColor',
    description:
      'Multicolor Icon의 색상은 정보의 명확한 구분과 시각적 일관성을 위해 정의된 팔레트 사용을 권장합니다. 라이트·다크 환경에서의 가독성과 색상 대비를 고려하여 컬러를 구성하였으나 서비스 특성 및 사용 목적에 따라 색상 변경이 가능합니다.',
    image: { src: img('09-color'), alt: '라이트/다크 모드 컬러 팔레트' },
  },
  {
    title: 'Size',
    description:
      '아이콘은 기본적으로 24px 크기로 제공되며, 용도에 맞게 비율을 유지하며 조정할 수 있습니다. 사용자의 시각적 인지를 고려하여 아래와 같은 최소 크기 및 베리언츠를 권장합니다.',
    bullets: [
      '아이콘의 최소 크기는 12px로 제한합니다.',
      <>
        14px 이하의 작은 사이즈에서는 시각적 복잡도를 줄이고 명확한 인지를 위해 <strong>Fill 형태의 사용을 권장</strong>
        합니다.
      </>,
      <>
        사용 환경 및 목적에 따라 <strong>사이즈별로 아이콘의 형태를 조정</strong>하여 표현할 수 있습니다.
      </>,
    ],
    image: { src: img('10-size'), alt: '12px~24px 사이즈별 아이콘 형태 변경' },
  },
  {
    title: '제작방법',
    description: '아이콘 오브젝트의 원형 보존 및 추후 변형의 용의성을 위해 원본과 배포하는 영역은 분리하여 보존합니다.',
    image: { src: img('11-production'), alt: 'Step 1~4 제작 과정' },
  },
  {
    title: '참고. 플러그인 SVG Simplizer(Compound Path)',
    description: '아이콘 오브젝트를 Flatten 까지 적용하는 것과 그 이후 플러그인을 적용하는 것은 SVG 추출 시, 차이가 있습니다.',
    image: { src: img('12-svg-simplizer'), alt: 'Flatten만 적용 vs 플러그인 적용 비교' },
  },
  {
    title: 'Icon naming convention',
    description: 'Figma 라이브러리 스타일을 작성하고 적재시, 아래의 네이밍 규칙을 적용합니다.',
    image: { src: img('13-naming'), alt: 'ic_[name]_[style] 네이밍 규칙과 예시' },
  },
]

function Heading({ title, badge, description }: { title: string; badge?: string; description: string }) {
  return (
    <div className="ds-section-heading">
      <h2>
        {title}
        {badge && <span className="ig-badge">{badge}</span>}
      </h2>
      <p>{description}</p>
    </div>
  )
}

function Figure({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="ig-figure">
      <img src={src} alt={alt} loading="lazy" />
    </figure>
  )
}

export default function IcongraphGuide() {
  return (
    <>
      {sections.map((s) => (
        <section key={s.title} className="ds-section">
          <Heading title={s.title} badge={s.badge} description={s.description} />
          {s.bullets && (
            <ul className="ig-bullets">
              {s.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
          <Figure {...s.image} />
          {s.extra && (
            <div className="ig-extra">
              <Heading title={s.extra.title} badge={s.extra.badge} description={s.extra.description} />
              <Figure {...s.extra.image} />
            </div>
          )}
        </section>
      ))}
    </>
  )
}
