// Brownian-ish random walk that gradually reveals “404”.
// No dependencies; intended to fit the site's minimal vibe.

(function () {
    const canvas = document.getElementById("brownian404");
    if (!canvas) return;

    // If the user opens the ⓘ explanation, ensure it scrolls into view.
    // (Useful on small screens where the disclosure might open below the fold.)
    const vizHelp = document.querySelector("details.viz-help");
    if (vizHelp) {
        vizHelp.addEventListener("toggle", () => {
            if (vizHelp.open) {
                // Let layout update, then scroll so the explanation is fully visible.
                setTimeout(() => {
                    const box = vizHelp.querySelector(".viz-help-box");
                    if (!box) return;

                    const margin = 12;
                    const rect = box.getBoundingClientRect();
                    const vh = window.innerHeight || document.documentElement.clientHeight;

                    // If the box is taller than the viewport, align its top.
                    // Otherwise, ensure its bottom fits too.
                    let delta = 0;
                    if (rect.height + margin * 2 > vh) {
                        delta = rect.top - margin;
                    } else if (rect.bottom > vh - margin) {
                        delta = rect.bottom - (vh - margin);
                    } else if (rect.top < margin) {
                        delta = rect.top - margin;
                    }

                    if (Math.abs(delta) > 1) {
                        window.scrollBy({ top: delta, behavior: "smooth" });
                    }

                    box.focus({ preventScroll: true });
                }, 50);
            }
        });
    }

    // Write the actual missing path into the page (nice little touch).
    const pathEl = document.getElementById("nf-path");
    if (pathEl) {
        pathEl.textContent = window.location.pathname;
    }

    const ctx = canvas.getContext("2d", { alpha: false });

    // Offscreen stencil where we render the text. We'll drift walkers toward it.
    const stencil = document.createElement("canvas");
    const sctx = stencil.getContext("2d");

    let W = 0;
    let H = 0;
    let dpr = 1;

    // Simulation state
    let walkers = [];
    let targetPoints = [];
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

    function resize() {
        // Match CSS size.
        const rect = canvas.getBoundingClientRect();
        dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
        W = Math.max(320, Math.floor(rect.width));
        H = Math.max(200, Math.floor(rect.height));

        canvas.width = Math.floor(W * dpr);
        canvas.height = Math.floor(H * dpr);
        canvas.style.width = `${W}px`;
        canvas.style.height = `${H}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingEnabled = true;

        stencil.width = W;
        stencil.height = H;

        buildStencil();
        restart();
    }

    function buildStencil() {
        sctx.setTransform(1, 0, 0, 1, 0, 0);
        sctx.clearRect(0, 0, W, H);

        // Draw an OUTLINE stencil of “404”, then sample pixels.
        // Using an outline keeps the interior (counters) clean and readable.
        const fontSize = Math.floor(Math.min(W * 0.42, H * 0.85));
        sctx.strokeStyle = "#000";
        sctx.textAlign = "center";
        sctx.textBaseline = "middle";
        sctx.font = `700 ${fontSize}px monospace`;
        sctx.lineWidth = Math.max(6, Math.floor(fontSize / 12));
        sctx.lineJoin = "round";
        sctx.lineCap = "round";
        sctx.strokeText("404", W / 2, H / 2);

        const img = sctx.getImageData(0, 0, W, H).data;

        // Sample target points from outline pixels.
        // Use a stride so we don't create an absurd amount of points.
        targetPoints = [];
        const stride = Math.max(2, Math.floor(fontSize / 55));
        for (let y = 0; y < H; y += stride) {
            for (let x = 0; x < W; x += stride) {
                const idx = (y * W + x) * 4;
                // If the pixel is non-white, it's part of the text.
                if (img[idx + 3] > 10 && img[idx] < 50) {
                    targetPoints.push({ x, y });
                }
            }
        }

        // If for any reason sampling failed, fall back to a simple centered blob.
        if (targetPoints.length < 50) {
            for (let i = 0; i < 800; i++) {
                targetPoints.push({
                    x: W / 2 + (Math.random() - 0.5) * W * 0.2,
                    y: H / 2 + (Math.random() - 0.5) * H * 0.2,
                });
            }
        }
    }

    function restart() {
        // Clear the visible canvas (white background).
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, W, H);

        // Create walkers at random positions.
        const rand = mulberry32((Date.now() ^ (W << 16) ^ H) >>> 0);

        walkers = [];
        // Spawn walkers near the stencil to avoid “scribbling” all over the canvas.
        const nWalkers = Math.max(140, Math.min(520, Math.floor(targetPoints.length / 3)));
        for (let i = 0; i < nWalkers; i++) {
            const tp = targetPoints[Math.floor(rand() * targetPoints.length)];
            walkers.push({
                x: tp.x + (rand() - 0.5) * 14,
                y: tp.y + (rand() - 0.5) * 14,
                vx: 0,
                vy: 0,
                t: Math.floor(rand() * targetPoints.length),
            });
        }
    }

    function substep() {
        // Settings chosen to be subtle (works with the site's stark theme).
        const noise = 0.55; // random motion
        const drift = 0.9; // attraction to target point
        const friction = 0.82;
        const ink = "rgba(0,0,0,0.10)";

        ctx.fillStyle = ink;

        for (let i = 0; i < walkers.length; i++) {
            const w = walkers[i];
            const p = targetPoints[w.t];

            // Occasionally retarget to another point.
            if ((i + (performance.now() | 0)) % 17 === 0) {
                w.t = (w.t + 1 + ((Math.random() * 7) | 0)) % targetPoints.length;
            }

            // Brownian increment + drift toward the outline.
            const dx = p.x - w.x;
            const dy = p.y - w.y;
            w.vx = w.vx * friction + dx * drift * 0.01 + (Math.random() - 0.5) * noise;
            w.vy = w.vy * friction + dy * drift * 0.01 + (Math.random() - 0.5) * noise;

            const x0 = w.x;
            const y0 = w.y;
            w.x += w.vx;
            w.y += w.vy;

            // Keep walkers in-bounds; if they drift away, re-seed near the stencil.
            if (w.x < 0 || w.x >= W || w.y < 0 || w.y >= H) {
                const tp = targetPoints[(Math.random() * targetPoints.length) | 0];
                w.x = tp.x + (Math.random() - 0.5) * 14;
                w.y = tp.y + (Math.random() - 0.5) * 14;
                w.vx = 0;
                w.vy = 0;
            }

            // Only deposit ink when we're close to the stencil.
            // (This prevents the interior from getting filled in.)
            if (dx * dx + dy * dy < 18 * 18) {
                ctx.beginPath();
                ctx.moveTo(x0, y0);
                ctx.lineTo(w.x, w.y);
                ctx.strokeStyle = ink;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }

    function step() {
        // Multiple physics steps per frame makes the reveal noticeably faster.
        const stepsPerFrame = 3;
        for (let k = 0; k < stepsPerFrame; k++) substep();
        raf = requestAnimationFrame(step);
    }

    function start() {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(step);
    }

    // Interactions
    canvas.addEventListener("click", () => {
        restart();
    });

    window.addEventListener("resize", () => {
        // avoid over-triggering on mobile; still simple.
        resize();
    });

    // Go.
    resize();
    start();
})();
