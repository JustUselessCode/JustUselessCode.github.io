import type { Component } from 'solid-js';
import { createSignal, onMount, onCleanup } from 'solid-js';

const TARGET_DATE = new Date('2026-06-21T10:45:00');
const START_DATE = new Date('2026-03-27T10:45:00');
const HALF_WAY_DATE = new Date((START_DATE.getTime() + TARGET_DATE.getTime()) / 2);
const loves = ['😘', '😍', '🥰', '❤️'];

const App: Component = () => {
  const [remainingMs, setRemainingMs] =
    createSignal<number>(Math.max(0, TARGET_DATE.getTime() - Date.now()));

  const [halfWayRemainingMs, setHalfWayRemainingMs] =
    createSignal<number>(Math.max(0, HALF_WAY_DATE.getTime() - Date.now()));

  // const [kisses, setKisses] = createSignal<number>(0);

  let timer = 0;

  onMount(() => {
    timer = window.setInterval(() => {
      setRemainingMs(Math.max(0, TARGET_DATE.getTime() - Date.now()));
      setHalfWayRemainingMs(Math.max(0, HALF_WAY_DATE.getTime() - Date.now()));
    }, 1000);
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
      <button class="kiss-button" onClick={spawnKissEmoji}>Love</button>
      <section class="timer" aria-live="polite">
        <h1>Counting down to:</h1>
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

function getRandomLoveEmoji() {
  return loves[Math.floor(Math.random() * loves.length)];
}

function spawnKissEmoji() {
  const kiss = document.createElement('div');
  kiss.textContent = getRandomLoveEmoji();
  kiss.className = 'kiss';
  kiss.style.position = 'fixed';
  kiss.style.pointerEvents = 'none';
  kiss.style.zIndex = '9999';
  const size = 22 + Math.floor(Math.random() * 22); // random size between 22-44px
  kiss.style.fontSize = `${size}px`;
  const maxX = Math.max(0, window.innerWidth - size - 8);
  const maxY = Math.max(0, window.innerHeight - size - 8);
  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);
  kiss.style.left = `${x}px`;
  kiss.style.top = `${y}px`;
  kiss.style.opacity = '1';
  kiss.style.transform = 'translateY(0)';
  kiss.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
  document.body.appendChild(kiss);
  // trigger float up + fade out
  requestAnimationFrame(() => {
    kiss.style.transform = 'translateY(-80px)';
    kiss.style.opacity = '0';
  });
  // remove after 1s
  setTimeout(() => {
    if (kiss.parentNode) kiss.parentNode.removeChild(kiss);
  }, 1000);
}

export default App;
