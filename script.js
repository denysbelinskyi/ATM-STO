const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
document.getElementById("year").textContent = new Date().getFullYear();

const dateInput = document.querySelector('input[type="date"]');
if (dateInput) {
  const now = new Date();
  dateInput.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split("T")[0];
}

const menuButton = document.querySelector(".menu");
const navLinks = document.querySelector(".nav-links");
if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => { navLinks.classList.toggle("open"); menuButton.classList.toggle("open"); });
  navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => navLinks.classList.remove("open")));
}

const form = document.getElementById("bookingForm");
const formNote = document.getElementById("formNote");
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const data = Object.fromEntries(new FormData(form).entries());
    if (data["bot-field"]) return;
    button.disabled = true;
    button.textContent = "Надсилаємо…";
    formNote.textContent = "Надсилаємо заявку менеджеру…";
    try {
      const response = await fetch("/api/telegram-booking", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Помилка");
      form.reset();
      formNote.textContent = "✓ Заявку надіслано. Очікуйте підтвердження від СТО.";
    } catch (error) {
      formNote.textContent = `Не вдалося надіслати: ${error.message}. Можна зателефонувати за номером 050 130 55 04.`;
    } finally {
      button.disabled = false;
      button.innerHTML = 'Надіслати заявку <span>↗</span>';
    }
  });
}

// Reliable back-to-top behavior
const toTop = document.querySelector('.to-top');
if (toTop) {
  toTop.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Seamless one-line marquee: two identical strips move continuously.
(() => {
  const ticker = document.querySelector('.ticker');
  const track = ticker?.querySelector('.ticker-track');
  const source = track?.querySelector('.ticker-group');
  if (!ticker || !track || !source) return;

  const itemHTML = source.innerHTML;
  track.innerHTML = '';

  const makeStrip = () => {
    const strip = document.createElement('div');
    strip.className = 'ticker-set';
    // Repeat enough times that one strip is always wider than the viewport.
    for (let i = 0; i < 4; i += 1) {
      const group = document.createElement('div');
      group.className = 'ticker-group';
      group.innerHTML = itemHTML;
      strip.appendChild(group);
    }
    return strip;
  };

  const first = makeStrip();
  const second = makeStrip();
  second.setAttribute('aria-hidden', 'true');
  track.append(first, second);

  requestAnimationFrame(() => {
    const distance = first.getBoundingClientRect().width;
    const speed = window.innerWidth < 600 ? 16 : 20;
    const animation = track.animate(
      [
        { transform: 'translate3d(0,0,0)' },
        { transform: `translate3d(-${distance}px,0,0)` }
      ],
      {
        duration: (distance / speed) * 1000,
        iterations: Infinity,
        easing: 'linear'
      }
    );
    animation.play();
  });
})();
