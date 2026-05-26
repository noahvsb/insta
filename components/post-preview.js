class PostPreview extends HTMLElement {
  async connectedCallback() {
    const src = this.getAttribute('src');

    let data;
    try {
      const res = await fetch(src);
      data = await res.json();
    } catch (err) {
      console.error('Error fetching post preview:', err);
      this.innerHTML = `<p class="preview-error">Failed to load.</p>`;
      return;
    }

    const href = this.getAttribute('href') || '#';
    const thumbnail = data.images?.[0] ?? '';

    this.innerHTML = `
      <style>
        post-preview {
          display: block;
        }

        .preview-link {
          display: block;
          text-decoration: none;
          color: inherit;
        }

        .preview-thumb {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          display: block;
          background: #f5f5f5;
          transition: opacity 0.2s ease;
        }

        .preview-link:hover .preview-thumb {
          opacity: 0.85;
        }

        .preview-meta {
          padding: 6px 2px;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .preview-date {
          font-family: 'Courier New', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #999;
        }

        .preview-count {
          font-family: 'Courier New', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          color: #999;
        }
      </style>

      <a class="preview-link" href="${href}">
        <img class="preview-thumb" src="${thumbnail}" alt="${data.description}" loading="lazy">
        <div class="preview-meta">
          <span class="preview-date">${data.date}</span>
         ${data.images.length > 1 ? `<span class="preview-count">+${data.images.length - 1}</span>` : ''}
        </div>
      </a>
    `;
  }
}

customElements.define('post-preview', PostPreview);