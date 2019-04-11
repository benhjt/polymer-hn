import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '@polymer/polymer/lib/elements/dom-repeat.js';

import './hn-comment.js';

class HnStory extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          padding: 1rem;
        }
      </style>

      <h1>[[story.title]]</h1>

      <template is="dom-repeat" items="[[story.comments]]" as="comment">
        <hn-comment comment="[[comment]]"></hn-comment>
      </template>
    `;
  }

  static get properties() {
    return {
      subroute: Object,
      itemId: {
        type: String,
        computed: '_getStoryId(subroute)',
        observer: '_doRequest'
      },
      story: Object
    };
  }

  _doRequest(itemId) {
    if (itemId) {
      fetch('https://node-hnapi.herokuapp.com/item/' + itemId).then(response => {
        return response.json();
      }).then(json => {
        this.story = json;
        return;
      }).catch(error => {
        // swallow
      });
    }
  }

  _getStoryId(subroute) {
    return subroute && subroute.path ? subroute.path.substr(1) : '';
  }
};

window.customElements.define('hn-story', HnStory);
