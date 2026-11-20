// Figma SVG 붙여넣기용 직렬화 유틸입니다. IconLibrary MotionDetailPanel에서 옮겼습니다.
const XLINK_NS = "http://www.w3.org/1999/xlink";

async function webpDataUrlToPng(dataUrl: string): Promise<string> {
  const img = new Image();
  img.src = dataUrl;
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  canvas.getContext("2d")?.drawImage(img, 0, 0);
  return canvas.toDataURL("image/png");
}

// Figma's SVG import drops WebP data URIs, so embedded images are converted to
// PNG, and layers lottie hides (display="none") are pruned to keep the paste small.
export async function serializeSvgForFigma(svgEl: SVGSVGElement): Promise<string> {
  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  clone.querySelectorAll('[display="none"]').forEach((el) => el.remove());
  clone.querySelectorAll("g").forEach((el) => {
    if (el.style.display === "none") el.remove();
  });
  const usedIds = new Set(
    Array.from(clone.querySelectorAll("use")).map((el) =>
      (el.getAttribute("href") ?? el.getAttributeNS(XLINK_NS, "href") ?? "").replace(/^#/, "")
    )
  );
  clone.querySelectorAll("defs > image").forEach((el) => {
    if (!usedIds.has(el.id)) el.remove();
  });
  const cache = new Map<string, Promise<string>>();
  await Promise.all(
    Array.from(clone.querySelectorAll("image")).map(async (el) => {
      const href = el.getAttribute("href") ?? el.getAttributeNS(XLINK_NS, "href") ?? "";
      if (!href.startsWith("data:image/webp")) return;
      let png = cache.get(href);
      if (!png) {
        png = webpDataUrlToPng(href);
        cache.set(href, png);
      }
      const converted = await png;
      if (el.hasAttribute("href")) el.setAttribute("href", converted);
      if (el.hasAttributeNS(XLINK_NS, "href")) el.setAttributeNS(XLINK_NS, "xlink:href", converted);
    })
  );
  flattenGroups(clone);
  return clone.outerHTML;
}

function parseMatrix(value: string | null): DOMMatrix {
  if (!value) return new DOMMatrix();
  try {
    return new DOMMatrix(value);
  } catch {
    return new DOMMatrix();
  }
}

function matrixAttr(m: DOMMatrix): string {
  const r = (n: number) => Math.round(n * 1e5) / 1e5;
  return `matrix(${r(m.a)},${r(m.b)},${r(m.c)},${r(m.d)},${r(m.e)},${r(m.f)})`;
}

// Bounding box of a clipPath/mask that is a single opaque rect or rect-shaped path.
function clipBounds(clipEl: Element): [number, number, number, number] | null {
  if (clipEl.children.length !== 1) return null;
  const shape = clipEl.children[0];
  if (shape.tagName === "rect") {
    const [x, y, w, h] = ["x", "y", "width", "height"].map((k) => parseFloat(shape.getAttribute(k) ?? "0"));
    return [x, y, x + w, y + h];
  }
  const fill = shape.getAttribute("fill");
  if (clipEl.tagName === "mask" && fill && !/^(#fff(fff)?|white)$/i.test(fill)) return null;
  if (shape.getAttribute("fill-opacity") === "0" || shape.getAttribute("opacity") === "0") return null;
  const d = shape.tagName === "path" ? (shape.getAttribute("d") ?? "") : "";
  if (!d || /[^MLCZz\s,.\-\d]/.test(d)) return null;
  const nums = (d.match(/-?\d*\.?\d+/g) ?? []).map(Number);
  if (nums.length < 8 || nums.length % 2) return null;
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ys = nums.filter((_, i) => i % 2 === 1);
  const [x0, y0, x1, y1] = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  // Every point must sit on a corner, otherwise a curve could bulge inside the box.
  const onCorner = xs.every((x, i) => (x === x0 || x === x1) && (ys[i] === y0 || ys[i] === y1));
  return onCorner ? [x0, y0, x1, y1] : null;
}

// Whether the clip-path/mask on `el` (positioned by `ctm`) changes nothing: it either
// covers the whole canvas, or covers every image the group contains.
function hasNoopClip(svgEl: SVGSVGElement, el: Element, ctm: DOMMatrix): boolean {
  const attr = el.getAttribute("clip-path") ?? el.getAttribute("mask") ?? "";
  const ref = /url\(#([^)]+)\)/.exec(attr)?.[1];
  const clipEl = ref ? svgEl.querySelector(`[id="${ref}"]`) : null;
  const bounds = clipEl ? clipBounds(clipEl) : null;
  if (!bounds) return false;
  const [x0, y0, x1, y1] = bounds;

  const kids = Array.from(el.children);
  if (kids.length && kids.every((k) => k.tagName === "image" && !k.hasAttribute("transform"))) {
    const covers = kids.every((k) => {
      const w = parseFloat(k.getAttribute("width") ?? "");
      const h = parseFloat(k.getAttribute("height") ?? "");
      const kx = parseFloat(k.getAttribute("x") ?? "0");
      const ky = parseFloat(k.getAttribute("y") ?? "0");
      return w > 0 && h > 0 && x0 <= kx && y0 <= ky && x1 >= kx + w && y1 >= ky + h;
    });
    if (covers) return true;
  }

  if (kids.length && kids.every((k) => k.tagName === "path")) {
    const inside = kids.every((k) => {
      const d = k.getAttribute("d") ?? "";
      if (/[^MLCZz\s,.\-\d]/.test(d)) return false;
      const nums = (d.match(/-?\d*\.?\d+(?:e-?\d+)?/g) ?? []).map(Number);
      if (nums.length < 2 || nums.length % 2) return false;
      const m = parseMatrix(k.getAttribute("transform"));
      const pad = k.hasAttribute("stroke") ? parseFloat(k.getAttribute("stroke-width") ?? "1") : 0;
      // Control points enclose the curve, so if they fit the clip the curve does too.
      for (let i = 0; i < nums.length; i += 2) {
        const p = m.transformPoint(new DOMPoint(nums[i], nums[i + 1]));
        if (p.x - pad < x0 || p.x + pad > x1 || p.y - pad < y0 || p.y + pad > y1) return false;
      }
      return true;
    });
    if (inside) return true;
  }

  const pts = [
    ctm.transformPoint(new DOMPoint(x0, y0)),
    ctm.transformPoint(new DOMPoint(x1, y1)),
    ctm.transformPoint(new DOMPoint(x0, y1)),
    ctm.transformPoint(new DOMPoint(x1, y0)),
  ];
  const vb = svgEl.viewBox.baseVal;
  const eps = 0.5;
  return (
    Math.min(...pts.map((p) => p.x)) <= vb.x + eps &&
    Math.min(...pts.map((p) => p.y)) <= vb.y + eps &&
    Math.max(...pts.map((p) => p.x)) >= vb.x + vb.width - eps &&
    Math.max(...pts.map((p) => p.y)) >= vb.y + vb.height - eps
  );
}

// Removes <g> wrappers by pushing their transform/opacity down onto the children.
// Groups that still carry a real clip-path or mask are kept, since dropping those
// would change how the artwork looks.
function flattenGroups(svgEl: SVGSVGElement) {
  const ctms = new Map<Element, DOMMatrix>();
  const measure = (parent: Element, acc: DOMMatrix) => {
    for (const child of Array.from(parent.children)) {
      if (child.tagName === "defs") continue;
      const own = acc.multiply(parseMatrix(child.getAttribute("transform")));
      ctms.set(child, own);
      if (child.tagName === "g") measure(child, own);
    }
  };
  measure(svgEl, new DOMMatrix());
  const unwrap = (parent: Element) => {
    for (const child of Array.from(parent.children)) {
      if (child.tagName === "defs") continue;
      if (child.tagName === "g") unwrap(child);
      if (child.tagName !== "g") continue;
      if (
        (child.hasAttribute("clip-path") || child.hasAttribute("mask")) &&
        hasNoopClip(svgEl, child, ctms.get(child) ?? new DOMMatrix())
      ) {
        child.removeAttribute("clip-path");
        child.removeAttribute("mask");
      }
      if (child.hasAttribute("clip-path") || child.hasAttribute("mask")) continue;
      const m = parseMatrix(child.getAttribute("transform"));
      const opacity = parseFloat(child.getAttribute("opacity") ?? "1");
      for (const grand of Array.from(child.children)) {
        const combined = m.multiply(parseMatrix(grand.getAttribute("transform")));
        if (!combined.isIdentity) grand.setAttribute("transform", matrixAttr(combined));
        if (opacity !== 1) {
          const own = parseFloat(grand.getAttribute("opacity") ?? "1");
          grand.setAttribute("opacity", String(Math.round(own * opacity * 1e4) / 1e4));
        }
        parent.insertBefore(grand, child);
      }
      child.remove();
    }
  };
  unwrap(svgEl);
  svgEl.removeAttribute("style");
  svgEl.querySelectorAll("[style]").forEach((el) => el.removeAttribute("style"));
  svgEl.querySelectorAll("[class]").forEach((el) => el.removeAttribute("class"));
  const used = svgEl.outerHTML;
  svgEl.querySelectorAll("clipPath, mask").forEach((el) => {
    if (!used.includes(`#${el.id})`)) el.remove();
  });
  svgEl.querySelectorAll("defs").forEach((el) => {
    if (!el.children.length) el.remove();
  });
}

