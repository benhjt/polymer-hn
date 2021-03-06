import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class HnStoryListItem extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          border-bottom: 1px solid #eeeeee;
        }

        .story {
          display: flex;
        }

        .story__index {
          align-self: center;
          font-weight: bold;
          margin-right: 15px;
          min-width: 1em;
          text-align: right;
        }

        .story__link {
          color: #212121;
          text-decoration: none;
        }

        .story__link:visited {
          color: #727272;
        }
      </style>

      <div class="story">
        <span class="story__index">[[index]]</span>
        <div class="story__info">
          <div class="story__title">
            <a href="[[story.url]]" class="story__link" target="_blank" rel="noopener">[[storyTitle]]</a>
          </div>
          <small class="story__details">
            [[story.points]] points by <a href="/user/[[story.user]]">[[story.user]]</a> [[story.time_ago]] | <a href="/story/[[story.id]]">[[story.comments_count]] comments</a>
          </small>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      index: Number,
      story: Object,
      storyTitle: {
        type: String,
        computed: '_buildStoryTitle(story)'
      }
    }
  }

  _buildStoryTitle(story) {
    return story.title + (story.domain ? " (" + story.domain + ")" : "");
  }
}

window.customElements.define('hn-story-list-item', HnStoryListItem);
