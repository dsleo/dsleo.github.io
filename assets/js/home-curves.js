// Homepage visualization: cumulative post counts over time, one curve per category.
// Minimal, dependency-free, and consistent with the site's monochrome style.
//
// Rendering strategy:
// - Extract posts (date, category) from an inline JSON script tag.
// - Build cumulative counts at unique dates.
// - Smooth the polyline with a monotone cubic (Fritsch–Carlson) interpolation.
//   This keeps the curve smooth while preserving monotonicity.
// - Animate a pen-plotter style reveal unless prefers-reduced-motion.

(function () {
    const canvas = document.getElementById("homeCurves");
    if (!canvas) return;

    const dataEl = document.getElementById("homeCurvesData");
    if (!dataEl) return;

    let posts = [];
    try {
        posts = JSON.parse(dataEl.textContent || "[]");
    } catch {
        posts = [];
    }
    if (!Array.isArray(posts) || posts.length === 0) return;

    // Parse and normalize.
    const rows = posts
        .map((p) => {
            const d = new Date(p.date);
            const t = Number.isFinite(d.getTime()) ? d.getTime() : NaN;
            const category = (p.category || "").toString().trim();
            return { t, category, title: p.title || "", url: p.url || "" };
        })
        .filter((r) => Number.isFinite(r.t) && r.category.length > 0);

    if (rows.length === 0) return;

    const prefersReducedMotion =
        window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = canvas.getContext("2d", { alpha: false });

    let W = 0;
    let H = 0;
    let dpr = 1;
    let raf = null;

    function mulberry32(seed) {
        let t = seed >>> 0;
        return function () {
            t += 0x6d2b79f5;
            let x = Math.imul(t ^ (t >>> 15), 1 | t);
            x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
            return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
        };
    }

    function clamp(x, a, b) {
        return Math.max(a, Math.min(b, x));
    }

    function uniqSorted(arr) {
        const a = Array.from(new Set(arr));
        a.sort((x, y) => x - y);
        return a;
    }

    function uniqSortedStr(arr) {
        const a = Array.from(new Set(arr));
        a.sort((x, y) => x.localeCompare(y));
        return a;
    }

    // Fritsch–Carlson monotone cubic interpolation.
    // Given x strictly increasing and y monotone nondecreasing, returns tangent m_i.
    function monotoneTangents(x, y) {
        const n = x.length;
        const m = new Array(n).fill(0);
        if (n < 2) return m;
        const d = new Array(n - 1);
        const h = new Array(n - 1);
        for (let i = 0; i < n - 1; i++) {
            h[i] = x[i + 1] - x[i];
            d[i] = (y[i + 1] - y[i]) / (h[i] || 1);
        }

        // Initial tangents: average of secants.
        m[0] = d[0];
        m[n - 1] = d[n - 2];
        for (let i = 1; i < n - 1; i++) {
            m[i] = (d[i - 1] + d[i]) / 2;
        }

        // Enforce monotonicity.
        for (let i = 0; i < n - 1; i++) {
            if (d[i] === 0) {
                m[i] = 0;
                m[i + 1] = 0;
            } else {
                const a = m[i] / d[i];
                const b = m[i + 1] / d[i];
                // If either slope is negative, clamp.
                if (a < 0) m[i] = 0;
                if (b < 0) m[i + 1] = 0;
                const s = a * a + b * b;
                if (s > 9) {
                    const tau = 3 / Math.sqrt(s);
                    m[i] = tau * a * d[i];
                    m[i + 1] = tau * b * d[i];
                }
            }
        }
        return m;
    }

    function sampleMonotoneCubic(x, y, m, samplesPerSeg) {
        const pts = [];
        const n = x.length;
        if (n === 0) return pts;
        if (n === 1) return [{ x: x[0], y: y[0] }];

        for (let i = 0; i < n - 1; i++) {
            const x0 = x[i];
            const x1 = x[i + 1];
            const y0 = y[i];
            const y1 = y[i + 1];
            const h = x1 - x0;
            const sps = Math.max(2, samplesPerSeg | 0);

            for (let j = 0; j < sps; j++) {
                const t = j / (sps - 1);
                const t2 = t * t;
                const t3 = t2 * t;
                const h00 = 2 * t3 - 3 * t2 + 1;
                const h10 = t3 - 2 * t2 + t;
                const h01 = -2 * t3 + 3 * t2;
                const h11 = t3 - t2;
                const xx = x0 + t * h;
                const yy = h00 * y0 + h10 * h * m[i] + h01 * y1 + h11 * h * m[i + 1];
                pts.push({ x: xx, y: yy });
            }
        }
        return pts;
    }

    function buildSeries() {
        // Sort posts by time.
        const sorted = rows.slice().sort((a, b) => a.t - b.t);
        const tMinData = sorted[0].t;
        const tMax = sorted[sorted.length - 1].t;

        // Start slightly before the first post so the y-axis shows a small empty segment.
        const span = Math.max(1, tMax - tMinData);
        const tMin = tMinData - span * 0.06;
        const categories = uniqSortedStr(sorted.map((r) => r.category));

        // For each category, build a cumulative series with one knot per post.
        // This gives us a natural “point per post” representation.
        const series = [];
        for (const cat of categories) {
            const catRows = sorted.filter((r) => r.category === cat);
            if (catRows.length === 0) continue;

            let cum = 0;
            const x = [tMin];
            const y = [0];
            const points = [];

            let prevT = tMin;
            for (const r of catRows) {
                let t = r.t;
                // Ensure strictly increasing x (required by interpolation).
                if (t <= prevT) t = prevT + 1;
                cum += 1;
                x.push(t);
                y.push(cum);
                points.push({ x: t, y: cum, title: r.title, url: r.url });
                prevT = t;
            }

            series.push({ category: cat, x, y, points, count: cum });
        }

        // Overall baseline: “all posts”.
        {
            let cum = 0;
            const x = [tMin];
            const y = [0];
            let prevT = tMin;

            for (const r of sorted) {
                let t = r.t;
                if (t <= prevT) t = prevT + 1;
                cum += 1;
                x.push(t);
                y.push(cum);
                prevT = t;
            }

            series.push({ category: "all", x, y, count: cum, isAll: true });
        }

        const yMax = Math.max(1, ...series.map((s) => s.count));
        return { series, tMin, tMax, yMax };
    }

    function resize() {
        const rect = canvas.getBoundingClientRect();
        dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
        W = Math.max(320, Math.floor(rect.width));
        H = Math.max(180, Math.floor(rect.height));

        canvas.width = Math.floor(W * dpr);
        canvas.height = Math.floor(H * dpr);
        canvas.style.width = `${W}px`;
        canvas.style.height = `${H}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingEnabled = true;
    }

    function clear() {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, W, H);
    }

    function drawAxes(frame) {
        const padL = 46;
        // Leave room on the right for end labels (category names).
        const padR = 68;
        const padT = 14;
        const padB = 28;
        const x0 = padL;
        const y0 = H - padB;
        const x1 = W - padR;
        const y1 = padT;

        // Axes
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y0);
        ctx.moveTo(x0, y0);
        ctx.lineTo(x0, y1);
        ctx.stroke();

        // Title-ish label (subtle)
        ctx.fillStyle = "#000";
        ctx.font = "12px monospace";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.globalAlpha = 0.9;
        ctx.fillText("cumulative posts", x0 + 2, y1 + 2);
        ctx.globalAlpha = 1;

        return { padL, padR, padT, padB, x0, x1, y0, y1 };
    }

    function niceTicks(maxY) {
        // Keep it tiny and readable: aim for ~4 ticks.
        const target = 4;
        const raw = maxY / target;
        const pow = Math.pow(10, Math.floor(Math.log10(raw || 1)));
        const candidates = [1, 2, 5, 10].map((k) => k * pow);
        let step = candidates[0];
        let best = Infinity;
        for (const c of candidates) {
            const n = Math.ceil(maxY / c);
            const score = Math.abs(n - target);
            if (score < best) {
                best = score;
                step = c;
            }
        }
        const ticks = [];
        for (let y = 0; y <= maxY + 1e-9; y += step) ticks.push(y);
        if (ticks[ticks.length - 1] < maxY) ticks.push(maxY);
        return ticks;
    }

    function drawGridAndTicks(bounds, yMax) {
        const { x0, x1, y0, y1 } = bounds;
        const ticks = niceTicks(yMax);

        ctx.font = "12px monospace";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";

        for (const t of ticks) {
            const yy = y0 - (t / yMax) * (y0 - y1);
            // grid line
            ctx.globalAlpha = 0.08;
            ctx.strokeStyle = "#000";
            ctx.beginPath();
            ctx.moveTo(x0, yy);
            ctx.lineTo(x1, yy);
            ctx.stroke();
            ctx.globalAlpha = 1;
            // label
            ctx.fillStyle = "#000";
            ctx.globalAlpha = 0.85;
            ctx.fillText(String(Math.round(t)), x0 - 6, yy);
            ctx.globalAlpha = 1;
        }
    }

    function formatYear(t) {
        return new Date(t).getFullYear().toString();
    }

    function drawXLabels(bounds, tMin, tMax) {
        const { x0, x1, y0 } = bounds;
        const y = y0 + 12;
        ctx.font = "12px monospace";
        ctx.fillStyle = "#000";
        ctx.textBaseline = "top";
        ctx.globalAlpha = 0.85;

        const left = formatYear(tMin);
        const right = formatYear(tMax);

        ctx.textAlign = "left";
        ctx.fillText(left, x0, y);
        ctx.textAlign = "right";
        ctx.fillText(right, x1, y);
        ctx.globalAlpha = 1;
    }

    function buildStyles(rand, categories) {
        // Monochrome: differentiate by dash patterns.
        const dashes = [
            [],
            [7, 4],
            [2, 3],
            [10, 3, 2, 3],
            [1, 4],
        ];

        // Shuffle dash assignment for a “reroll” feel.
        const dashPool = dashes.slice();
        for (let i = dashPool.length - 1; i > 0; i--) {
            const j = (rand() * (i + 1)) | 0;
            [dashPool[i], dashPool[j]] = [dashPool[j], dashPool[i]];
        }

        const map = new Map();
        let k = 0;
        for (const c of categories) {
            map.set(c, dashPool[k % dashPool.length]);
            k++;
        }
        // Overall baseline: always dotted.
        map.set("all", [1.5, 3.5]);
        return map;
    }

    function drawSeries(bounds, model, tNow, styleMap) {
        const { x0, x1, y0, y1 } = bounds;
        const { series, tMin, tMax, yMax } = model;

        const xScale = (x) => x0 + ((x - tMin) / (tMax - tMin || 1)) * (x1 - x0);
        const yScale = (yy) => y0 - (yy / yMax) * (y0 - y1);

        // Collect labels so we can avoid overlaps.
        const labels = [];

        for (const s of series) {
            const dash = styleMap.get(s.category) || [];
            ctx.setLineDash(dash);
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.strokeStyle = "#000";
            ctx.lineWidth = s.isAll ? 1 : 1.2;
            ctx.globalAlpha = s.isAll ? 0.35 : 0.85;

            // Smooth monotone cubic samples
            const m = monotoneTangents(s.x, s.y);
            const samplesPerSeg = Math.max(8, Math.floor((x1 - x0) / 90));
            const pts = sampleMonotoneCubic(s.x, s.y, m, samplesPerSeg);

            // Animate reveal by drawing only up to x <= tNow.
            const xLimit = xScale(tNow);
            let started = false;
            ctx.beginPath();
            for (let i = 0; i < pts.length; i++) {
                const xx = xScale(pts[i].x);
                const yy = yScale(pts[i].y);
                if (xx > xLimit) break;
                if (!started) {
                    ctx.moveTo(xx, yy);
                    started = true;
                } else {
                    ctx.lineTo(xx, yy);
                }
            }
            if (started) ctx.stroke();

            // Draw points (one per post) on top of each category curve.
            if (!s.isAll && Array.isArray(s.points)) {
                ctx.setLineDash([]);
                ctx.globalAlpha = 0.95;
                for (const p of s.points) {
                    const px = xScale(p.x);
                    if (px > xLimit) continue;
                    const py = yScale(p.y);
                    ctx.beginPath();
                    ctx.arc(px, py, 2.3, 0, Math.PI * 2);
                    ctx.fillStyle = "#fff";
                    ctx.fill();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = "#000";
                    ctx.stroke();
                }
                ctx.globalAlpha = s.isAll ? 0.35 : 0.85;
                ctx.setLineDash(dash);
            }

            // Collect end label (for non-baseline series).
            if (!s.isAll) {
                const xEndData = s.x[s.x.length - 1];
                const yEndData = s.y[s.y.length - 1];
                const xEnd = xScale(xEndData);
                if (xEnd <= xLimit + 0.5) {
                    labels.push({
                        text: s.category,
                        xEnd,
                        yEnd: yScale(yEndData),
                        dash,
                    });
                }
            }
        }

        // Lay out labels to avoid overlaps.
        if (labels.length > 0) {
            // Sort by natural y.
            labels.sort((a, b) => a.yEnd - b.yEnd);
            const minSep = 12; // px
            const top = y1 + 14;
            const bot = y0 - 10;

            // Greedy push-down.
            for (let i = 1; i < labels.length; i++) {
                if (labels[i].yEnd - labels[i - 1].yEnd < minSep) {
                    labels[i].yEnd = labels[i - 1].yEnd + minSep;
                }
            }

            // If we overflow bottom, shift everything up.
            const overflow = labels[labels.length - 1].yEnd - bot;
            if (overflow > 0) {
                for (const l of labels) l.yEnd -= overflow;
            }

            // If we overflow top, shift down.
            const underflow = top - labels[0].yEnd;
            if (underflow > 0) {
                for (const l of labels) l.yEnd += underflow;
            }

            // Draw leader lines + text.
            ctx.setLineDash([]);
            ctx.font = "12px monospace";
            ctx.fillStyle = "#000";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.globalAlpha = 0.9;

            for (const l of labels) {
                const xText = l.xEnd + 10;
                // leader
                ctx.globalAlpha = 0.45;
                ctx.beginPath();
                ctx.moveTo(l.xEnd, l.yEnd);
                ctx.lineTo(xText - 3, l.yEnd);
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 1;
                ctx.stroke();

                // label
                ctx.globalAlpha = 0.9;
                ctx.fillText(l.text, xText, l.yEnd);
            }

            ctx.globalAlpha = 1;
        }

        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
    }

    function render(seed, animate) {
        const rand = mulberry32(seed);
        const model = buildSeries();

        // Slightly pad yMax so the top curve doesn't touch the border.
        model.yMax = Math.max(1, model.yMax + 0.5);

        const categories = model.series.filter((s) => !s.isAll).map((s) => s.category);
        const styleMap = buildStyles(rand, categories);

        const tMin = model.tMin;
        const tMax = model.tMax;
        const durationMs = 1300;
        const tStart = performance.now();

        function frame(now) {
            clear();
            const bounds = drawAxes();
            drawGridAndTicks(bounds, model.yMax);
            drawXLabels(bounds, tMin, tMax);

            let tNow = tMax;
            if (animate) {
                const u = clamp((now - tStart) / durationMs, 0, 1);
                // Ease-in-out
                const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
                tNow = tMin + e * (tMax - tMin);
            }

            drawSeries(bounds, model, tNow, styleMap);

            if (animate && now - tStart < durationMs) {
                raf = requestAnimationFrame(frame);
            } else {
                raf = null;
            }
        }

        if (raf) cancelAnimationFrame(raf);
        if (animate) {
            raf = requestAnimationFrame(frame);
        } else {
            frame(performance.now());
        }
    }

    function start(seed) {
        resize();
        render(seed, !prefersReducedMotion);
    }

    // Interactions
    canvas.addEventListener("click", () => {
        start((Date.now() ^ (W << 16) ^ H) >>> 0);
    });

    window.addEventListener("resize", () => {
        // keep it simple; resize + rerender
        start((Date.now() ^ 0x9e3779b9) >>> 0);
    });

    // Go.
    start((Date.now() ^ 0x1234567) >>> 0);
})();
