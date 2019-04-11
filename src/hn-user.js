import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class HnUser extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          padding: 1rem;
        }

        td {
          padding: 0;
        }
      </style>

      <table>
        <tbody>
          <tr>
            <td>User:</td>
            <td>[[user.id]]</td>
          </tr>
          <tr>
            <td>Created:</td>
            <td>[[user.created]]</td>
          </tr>
          <tr>
            <td>Karma</td>
            <td>[[user.karma]]</td>
          </tr>
        </tbody>
      </table>
      <div class="about" hidden$="[[!user.about]]" inner-h-t-m-l="[[user.about]]"></div>
      <div class="links">
        <a href$="[[_hnLink('submitted', user.id)]]" target="_blank" rel="noopener">submissions</a>
        |
        <a href$="[[_hnLink('threads', user.id)]]" target="_blank" rel="noopener">comments</a>
        |
        <a href$="[[ _hnLink('favorites', user.id)]]" target="_blank" rel="noopener">favorites</a>
      </div>
    `;
  }
  static get properties() {
    return {
      subroute: Object,
      userId: {
        type: String,
        computed: '_getUserId(subroute)',
        observer: '_doRequest'
      },
      user: Object
    }
  }

  _doRequest(userId) {
    if (userId) {
      fetch('https://node-hnapi.herokuapp.com/user/' + userId).then(response => {
        return response.json();
      }).then(json => {
        this.user = json;
        return;
      }).catch(error => {
        // swallow
      });
    }
  }

  _getUserId(subroute) {
    return subroute && subroute.path ? subroute.path.substr(1) : '';
  }

  _hnLink(type, id) {
    return `https://news.ycombinator.com/${type}?id=${id}`;
  }
};

window.customElements.define('hn-user', HnUser);
