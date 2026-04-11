import type { Component } from 'solid-js';
import { createSignal, onMount, onCleanup } from 'solid-js';

const TARGET_DATE = new Date('2026-06-21T10:45:00');
const START_DATE = new Date('2026-03-27T10:45:00');
const HALF_WAY_DATE = new Date((START_DATE.getTime() + TARGET_DATE.getTime()) / 2);
const loves = ['😘', '😍', '🥰', '❤️'];
let loveCount = 0;
const [loveClicks, setLoveClicks] = createSignal<number>(0);

const App: Component = () => {
  const [remainingMs, setRemainingMs] =
    createSignal<number>(Math.max(0, TARGET_DATE.getTime() - Date.now()));

  const [halfWayRemainingMs, setHalfWayRemainingMs] =
    createSignal<number>(Math.max(0, HALF_WAY_DATE.getTime() - Date.now()));

  let timer = 0;

  const [isCute, setIsCute] = createSignal<boolean>(false);

  onMount(() => {
    // timer
    timer = window.setInterval(() => {
      setRemainingMs(Math.max(0, TARGET_DATE.getTime() - Date.now()));
      setHalfWayRemainingMs(Math.max(0, HALF_WAY_DATE.getTime() - Date.now()));
    }, 1000);

    // theme: read persisted preference or current document setting
    try {
      const pref = localStorage.getItem('theme');
      if (pref === 'cute') {
        document.documentElement.dataset.theme = 'cute';
        setIsCute(true);
      } else {
        document.documentElement.removeAttribute('data-theme');
        setIsCute(false);
      }
    } catch (e) {
      // ignore
    }
  });

  onCleanup(() => {
    clearInterval(timer);
  });

  const days = (ms: number) => Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = (ms: number) => Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = (ms: number) => Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = (ms: number) => Math.floor((ms % (1000 * 60)) / 1000);

  const twoDigit = (n: number) => n.toString().padStart(2, '0');

  return (
    <main class="app-root">
      <div class="header">
        <h1>Reunion Timer</h1>
        <div class="theme-toggle">
          <div class="label">Cute</div>
          <label class="switch">
            <input
              type="checkbox"
              checked={isCute()}
              onInput={(e) => {
                const checked = (e.currentTarget as HTMLInputElement).checked;
                if (checked) {
                  document.documentElement.dataset.theme = 'cute';
                  try { localStorage.setItem('theme', 'cute'); } catch (e) {}
                } else {
                  document.documentElement.removeAttribute('data-theme');
                  try { localStorage.setItem('theme', 'default'); } catch (e) {}
                }
                setIsCute(checked);
              }}
            />
            <span class="slider"></span>
          </label>
        </div>
      </div>
      <div class="card">
        <div class="value">{loveClicks()} / 20</div>
        <div class="label">Love Clicks</div>
        <button class="kiss-button" onClick={handleLoveClick}>
          Love
        </button>
      </div>

      <section class="timer" aria-live="polite">
        <h4>Return:
          <p class="subtitle">{TARGET_DATE.toLocaleDateString()}</p>
        </h4>
        <div class="time-grid">
          <div class="card">
            <div class="value">{days(remainingMs())}</div>
            <div class="label">Days</div>
          </div>
          <div class="card">
            <div class="value">{twoDigit(hours(remainingMs()))}</div>
            <div class="label">Hours</div>
          </div>
          <div class="card">
            <div class="value">{twoDigit(minutes(remainingMs()))}</div>
            <div class="label">Minutes</div>
          </div>
          <div class="card">
            <div class="value">{twoDigit(seconds(remainingMs()))}</div>
            <div class="label">Seconds</div>
          </div>
        </div>
      </section>

      <section class="timer">
        <h4>Halfwaypoint:
          <p class="subtitle">{HALF_WAY_DATE.toLocaleDateString()}</p>
        </h4>
        <div class="time-grid">
          <div class="card">
            <div class="value">{days(halfWayRemainingMs())}</div>
            <div class="label">Days</div>
          </div>
          <div class="card">
            <div class="value">{twoDigit(hours(halfWayRemainingMs()))}</div>
            <div class="label">Hours</div>
          </div>
          <div class="card">
            <div class="value">{twoDigit(minutes(halfWayRemainingMs()))}</div>
            <div class="label">Minutes</div>
          </div>
          <div class="card">
            <div class="value">{twoDigit(seconds(halfWayRemainingMs()))}</div>
            <div class="label">Seconds</div>
          </div>
        </div>
      </section>
    </main>
  );
};

function handleLoveClick() {
  loveCount += 1;
  const clicks = loveClicks();
  if (clicks == 20) {
    setLoveClicks(0);
    loveCount = 0;
  } else {
    setLoveClicks(loveCount);
  }

  if (loveCount % 20 === 0) {
    loveOverload();
  } else {
    spawnKissEmoji();
  }
}

function getRandomLoveEmoji() {
  return loves[Math.floor(Math.random() * loves.length)];
}

function loveOverload() {
  for (let i = 0; i < 80; i++) {
    spawnKissEmoji();
  }
}

function spawnKissEmoji() {
  const love = document.createElement('div');
  love.textContent = getRandomLoveEmoji();
  love.className = 'kiss';
  love.style.position = 'fixed';
  love.style.pointerEvents = 'none';
  love.style.zIndex = '9999';
  const size = 22 + Math.floor(Math.random() * 22); // random size between 22-44px
  love.style.fontSize = `${size}px`;
  const maxX = Math.max(0, window.innerWidth - size - 8);
  const maxY = Math.max(0, window.innerHeight - size - 8);
  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);
  love.style.left = `${x}px`;
  love.style.top = `${y}px`;
  love.style.opacity = '1';
  love.style.transform = 'translateY(0)';
  love.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
  document.body.appendChild(love);
  // trigger float up + fade out
  requestAnimationFrame(() => {
    love.style.transform = 'translateY(-80px)';
    love.style.opacity = '0';
  });
  // remove after 1s
  setTimeout(() => {
    if (love.parentNode) love.parentNode.removeChild(love);
  }, 5000);
}

export default App;
