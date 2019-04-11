import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '@polymer/polymer/lib/elements/dom-repeat.js';
import './hn-story-list-item.js';

class HnStoryList extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          padding: 1rem;
        }

        .pagination {
          padding-top: 16px;
          display: flex;
          justify-content: space-between;
        }

        .pagination__link {
          text-decoration: none;
        }

        .pagination__link:visited {
          color: #000;
        }
      </style>

      <template is="dom-repeat" items="[[stories]]" as="story">
        <hn-story-list-item story="[[story]]" index="[[_computeIndex(page, index)]]"></hn-story-list-item>
      </template>

      <div class="pagination">
        <a href="/story-list/[[_computePrevPage(page)]]" class="pagination__link">◀ Prev</a>
        <span>Page {{page}}</span>
        <a href="/story-list/[[_computeNextPage(page)]]" class="pagination__link">Next ▶</a>
      </div>
    `;
  }

  static get properties() {
    return {
      subroute: Object,
      page: {
        type: Number,
        computed: '_getPage(subroute)',
        observer: '_doRequest'
      },
      stories: Array
    };
  }

  constructor() {
    super();
    this.pageSize = 30;
  }

  _doRequest(page) {
    if (page) {
      fetch('https://node-hnapi.herokuapp.com/news?page=' + page).then(response => {
        return response.json();
      }).then(json => {
        // this.stories = json;
        this.set('stories', json);
        return;
      }).catch(error => {
        // swallow
      });
    }
  }

  _computeNextPage(page) {
    return (parseInt(page, 10) || 1) + 1
  }

  _computePrevPage(page) {
    return ((parseInt(page, 10) || 2) - 1) || 1;
  }

  _computeIndex(page, index) {
    return 30 * (page - 1) + index + 1;
  }

  _getPage(subroute) {
    return subroute && subroute.path ? subroute.path.substr(1) : 1;
  }
}

window.customElements.define('hn-story-list', HnStoryList);
