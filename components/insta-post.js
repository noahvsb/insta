class InstaPost extends HTMLElement {
  async connectedCallback() {
    const src = 'data.json';

    let data;
    try {
      const res = await fetch(src);
      data = await res.json();
    } catch (err) {
      console.error('Error fetching post data:', err);
      this.innerHTML = `<p class="post-error">Failed to load post.</p>`;
      return;
    }

    const images = data.images ?? [];
    const hasMultiple = images.length > 1;

    this.innerHTML = `
      <style>
        insta-post {
          display: block;
          font-family: 'Georgia', serif;
          max-width: 540px;
          margin: 2rem auto;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
          background: #fff;
        }

        .post-home {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 10px;
          font-family: 'Courier New', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #999;
          text-decoration: none;
        }

        .post-home:hover {
          color: #222;
        }

        .post-gallery {
          position: relative;
          background: #f5f5f5;
          aspect-ratio: 1;
          max-height: 320px;
          overflow: hidden;
        }

        .post-gallery img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .post-gallery img.active {
          opacity: 1;
        }

        .post-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.85);
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          transition: background 0.15s;
        }

        .post-nav:hover { background: #fff; }
        .post-nav.prev { left: 10px; }
        .post-nav.next { right: 10px; }

        .post-dots {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 5px;
        }

        .post-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          transition: background 0.2s;
        }

        .post-dot.active { background: #fff; }

        .post-body {
          padding: 14px 16px;
        }

        .post-date {
          font-family: 'Courier New', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          color: #999;
          text-transform: uppercase;
          margin: 0 0 8px;
        }

        .post-description {
          font-size: 0.95rem;
          line-height: 1.55;
          color: #222;
          margin: 0;
          white-space: pre-wrap;
        }
      </style>

      <a class="post-home" href="../..">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          back
      </a>

      <div class="post-gallery">
        ${images.map((src, i) => `
          <img src="${src}" alt="Post image ${i + 1}" class="${i === 0 ? 'active' : ''}" loading="lazy">
        `).join('')}

        ${hasMultiple ? `
          <button class="post-nav prev" aria-label="Previous">&#8249;</button>
          <button class="post-nav next" aria-label="Next">&#8250;</button>
          <div class="post-dots">
            ${images.map((_, i) => `<div class="post-dot ${i === 0 ? 'active' : ''}"></div>`).join('')}
          </div>
        ` : ''}
      </div>

      <div class="post-body">
        <p class="post-date">${data.date}</p>
        <p class="post-description">${data.description}</p>
      </div>
    `;

    // Gallery logic
    if (hasMultiple) {
      const imgs = this.querySelectorAll('.post-gallery img');
      const dots = this.querySelectorAll('.post-dot');
      let current = 0;

      const show = (idx) => {
        imgs[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (idx + imgs.length) % imgs.length;
        imgs[current].classList.add('active');
        dots[current].classList.add('active');
      };

      this.querySelector('.post-nav.prev').addEventListener('click', () => show(current - 1));
      this.querySelector('.post-nav.next').addEventListener('click', () => show(current + 1));
    }
  }
}

customElements.define('insta-post', InstaPost);