document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initButterflies();
});

// --- FEATURE 1: VIEWPORT SECTION OPENER CONTROLLER ---
function initNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn");
    const contentPanels = document.querySelectorAll(".content-panel");

    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Remove active tags across menu nodes
            navButtons.forEach(btn => btn.classList.remove("active"));
            contentPanels.forEach(panel => panel.classList.remove("active"));

            // Inject state changes to chosen targets
            button.classList.add("active");
            const targetSectionId = button.getAttribute("data-target");
            const targetPanel = document.getElementById(`panel-${targetSectionId}`);

            if (targetPanel) {
                targetPanel.classList.add("active");
            }
        });
    });
}

// --- FEATURE 2: NATURAL ENVIRONMENT BUTTERFLY SIMULATION ---
function initButterflies() {
    const butterflyCount = 5;
    const arrayContainer = [];

    for (let i = 0; i < butterflyCount; i++) {
        const el = document.createElement("div");
        el.className = "butterfly";

        const left = document.createElement("div");
        left.className = "wing";

        const right = document.createElement("div");
        right.className = "wing wing-right";

        el.appendChild(left);
        el.appendChild(right);
        document.body.appendChild(el);

        // Randomize wing glow configuration paths based on UI palette colors
        const glows = ["#00f0ff", "#39ff14", "#9d4edd"];
        const selectedGlow = glows[Math.floor(Math.random() * glows.length)];
        left.style.background = selectedGlow;
        right.style.background = selectedGlow;
        left.style.boxShadow = `0 0 8px ${selectedGlow}`;
        right.style.boxShadow = `0 0 8px ${selectedGlow}`;

        arrayContainer.push({
            element: el,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            targetX: Math.random() * window.innerWidth,
            targetY: Math.random() * window.innerHeight,
            speed: Math.random() * 1.2 + 0.8,
            angle: 0
        });
    }

    function stepEngine() {
        arrayContainer.forEach(b => {
            const dx = b.targetX - b.x;
            const dy = b.targetY - b.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 30) {
                // Pinpoint new coordinates when near the old destination target node
                b.targetX = Math.random() * window.innerWidth;
                b.targetY = Math.random() * window.innerHeight;
            } else {
                b.x += (dx / distance) * b.speed;
                b.y += (dy / distance) * b.speed;
                b.angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
            }

            b.element.style.left = `${b.x}px`;
            b.element.style.top = `${b.y}px`;
            b.element.style.transform = `rotate(${b.angle}deg)`;
        });
        requestAnimationFrame(stepEngine);
    }
    stepEngine();
}