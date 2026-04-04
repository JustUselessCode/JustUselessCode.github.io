import type { Component } from 'solid-js';
import { createSignal, onMount, onCleanup } from 'solid-js';

const TARGET_DATE = new Date('2026-06-21T10:45:00');

const App: Component = () => {
  const [remainingMs, setRemainingMs] = createSignal<number>(Math.max(0, TARGET_DATE.getTime() - Date.now()));

  let timer = 0;
  onMount(() => {
    timer = window.setInterval(() => {
      setRemainingMs(Math.max(0, TARGET_DATE.getTime() - Date.now()));
    }, 1000);
  });

  onCleanup(() => {
    clearInterval(timer);
  });

  const days = () => Math.floor(remainingMs() / (1000 * 60 * 60 * 24));
  const hours = () => Math.floor((remainingMs() % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = () => Math.floor((remainingMs() % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = () => Math.floor((remainingMs() % (1000 * 60)) / 1000);

  function two(n: number) {
    return n.toString().padStart(2, '0');
  }

  return (
    <main class="app-root">
      <header class="header">
        <h1>Time:</h1>
        <p class="subtitle">Counting down to {TARGET_DATE.toDateString()}</p>
      </header>

      <section class="timer" aria-live="polite">
        <div class="time-grid">
          <div class="card">
            <div class="value">{days()}</div>
            <div class="label">Days</div>
          </div>
          <div class="card">
            <div class="value">{two(hours())}</div>
            <div class="label">Hours</div>
          </div>
          <div class="card">
            <div class="value">{two(minutes())}</div>
            <div class="label">Minutes</div>
          </div>
          <div class="card">
            <div class="value">{two(seconds())}</div>
            <div class="label">Seconds</div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default App;
