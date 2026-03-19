import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie-service';
@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (movieService.isloading()) {
      <div class="spinner-overlay">
        <div class="spinner-content">

          <!-- Clapperboard -->
          <div class="clapper">

            <!-- Top part (the striped flap) -->
            <div class="clapper-top">
              <div class="stripes">
                @for (stripe of stripes; track stripe) {
                  <div class="stripe"></div>
                }
              </div>
              <div class="clapper-top-body"></div>
            </div>

            <!-- Bottom body -->
            <div class="clapper-body">
              <div class="clapper-line"></div>
              <div class="clapper-line short"></div>
              <div class="clapper-line"></div>
              <div class="clapper-dot-row">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>

          </div>

          <!-- Loading text -->
          <p class="loading-text">Loading<span class="dots"><span>.</span><span>.</span><span>.</span></span></p>
        </div>
      </div>
    }
  `,
  styles: [`
    .spinner-overlay {
      position: fixed;
      inset: 0;
      background: rgba(20, 5, 45, 0.85);
      backdrop-filter: blur(6px);
      display: grid;
      place-items: center;
      z-index: 9999;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .spinner-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    /* ── Clapperboard ── */
    .clapper {
      width: 90px;
      display: flex;
      flex-direction: column;
      filter: drop-shadow(0 0 18px #a855f7aa);
    }

    /* Top flap */
    .clapper-top {
      position: relative;
      transform-origin: bottom left;
      animation: clap 1.1s ease-in-out infinite;
    }

    @keyframes clap {
      0%   { transform: rotate(0deg); }
      15%  { transform: rotate(-38deg); }
      30%  { transform: rotate(0deg); }
      100% { transform: rotate(0deg); }
    }

    .stripes {
      display: flex;
      overflow: hidden;
      border-radius: 6px 6px 0 0;
      height: 18px;
    }

    .stripe {
      flex: 1;
      background: repeating-linear-gradient(
        90deg,
        #1a0533 0px,
        #1a0533 8px,
        #c084fc 8px,
        #c084fc 16px
      );
    }

    .clapper-top-body {
      height: 10px;
      background: #2d1052;
      border-left: 3px solid #a855f7;
      border-right: 3px solid #a855f7;
    }

    /* Bottom body */
    .clapper-body {
      background: #1e0a3c;
      border: 3px solid #a855f7;
      border-top: none;
      border-radius: 0 0 8px 8px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 7px;
    }

    .clapper-line {
      height: 3px;
      background: #6d28d9;
      border-radius: 2px;
      width: 100%;
    }

    .clapper-line.short {
      width: 60%;
    }

    .clapper-dot-row {
      display: flex;
      gap: 6px;
      margin-top: 2px;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #c084fc;
      animation: blink 1.1s ease-in-out infinite;
    }

    .dot:nth-child(2) { animation-delay: 0.15s; }
    .dot:nth-child(3) { animation-delay: 0.3s; }

    @keyframes blink {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50%       { opacity: 1;   transform: scale(1.3); }
    }

    /* ── Loading text ── */
    .loading-text {
      color: #e9d5ff;
      font-family: 'Georgia', serif;
      font-size: 15px;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin: 0;
    }

    .dots span {
      animation: dotFade 1.2s ease-in-out infinite;
      opacity: 0;
    }

    .dots span:nth-child(1) { animation-delay: 0s; }
    .dots span:nth-child(2) { animation-delay: 0.2s; }
    .dots span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes dotFade {
      0%, 80%, 100% { opacity: 0; }
      40%            { opacity: 1; }
    }
  `]
})
export class SpinnerComponent {
  public movieService =inject(MovieService)
  stripes = Array.from({length: 6}, (_, i) => i + 1);
}