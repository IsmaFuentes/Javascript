import { ClientSidePaginatedTable } from './modules/tables.js';

window.onload = () => {
  const container = document.querySelector('#tables');
  getDummyData().then((data) => {
    const { tableWrapper, filter, clear } = ClientSidePaginatedTable(data, 25);
    container.append(tableWrapper);

    document
      .querySelector('#filter-input')
      .addEventListener('keyup', function (e) {
        if (this.value.length >= 3) {
          filter(this.value, true);
        } else if (this.value.length == 0) {
          clear();
        }
      });

    document.querySelector('#clear-submit').addEventListener('click', clear);
  });
};

/**
 * https://random-data-api.com/documentation
 */
const getDummyData = async () => {
  const baseUri = 'https://random-data-api.com/api/v2/beers?size=100';
  return await fetch(baseUri, { headers: { contentType: 'application/json' } })
    .then((response) => response.json())
    .then((data) => data);
};

const getData = async () => {
  return new Promise((resolve) => {
    const source = [];
    const length = 100000;
    for (let i = 0; i < length; i++) {
      source.push({
        id: i,
        description: `description - ${i}`,
        dateTime: new Date().toISOString(),
      });
    }
    resolve(source);
  });
};
