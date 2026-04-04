import type { Component } from 'solid-js';
import { createSignal, onMount, onCleanup } from 'solid-js';

const TARGET_DATE = new Date('2026-06-21T10:45:00');
// Halfway between now and the target date (compute at mount)
const HALF_WAY_DATE = new Date((Date.now() + TARGET_DATE.getTime()) / 2);

const App: Component = () => {
  const [remainingMs, setRemainingMs] = createSignal<number>(Math.max(0, TARGET_DATE.getTime() - Date.now()));
  const [halfWayRemainingMs, setHalfWayRemainingMs] = createSignal<number>(Math.max(0, HALF_WAY_DATE.getTime() - Date.now()));

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

  function two(n: number) {
    return n.toString().padStart(2, '0');
  }

  return (
    <main class="app-root">
      <header class="header">
        <h1>Counting down to:</h1>
      </header>

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
            <div class="value">{two(hours(remainingMs()))}</div>
            <div class="label">Hours</div>
          </div>
          <div class="card">
            <div class="value">{two(minutes(remainingMs()))}</div>
            <div class="label">Minutes</div>
          </div>
          <div class="card">
            <div class="value">{two(seconds(remainingMs()))}</div>
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
            <div class="value">{two(hours(halfWayRemainingMs()))}</div>
            <div class="label">Hours</div>
          </div>
          <div class="card">
            <div class="value">{two(minutes(halfWayRemainingMs()))}</div>
            <div class="label">Minutes</div>
          </div>
          <div class="card">
            <div class="value">{two(seconds(halfWayRemainingMs()))}</div>
            <div class="label">Seconds</div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default App;
