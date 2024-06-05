import { CreatePaginatedTable } from './modules/tables.js';

window.onload = () => {
  const container = document.querySelector('#tables');
  createDataSource().then((data) => {
    const { tableWrapper, filter, reset } = CreatePaginatedTable(data, 100);
    container.append(tableWrapper);

    document
      .querySelector('#filter-input')
      .addEventListener('keyup', function (e) {
        if (this.value.length >= 2) {
          filter(this.value);
        } else if (this.value.length == 0) {
          reset();
        }
      });

    document
      .querySelector('#clear-submit')
      .addEventListener('click', () => reset());
  });
};

const createDataSource = async () => {
  return new Promise((resolve) => {
    const source = [];
    const length = 100000;
    for (let i = 0; i < length; i++) {
      source.push({
        id: i,
        uuid: crypto.randomUUID(),
        description: `lorem ipsum `.repeat(5),
        date: new Date().toISOString(),
        rev: length - (i + 1),
      });
    }
    resolve(source);
  });
};

// /**
//  * https://random-data-api.com/documentation
//  */
// const getDummyData = async () => {
//   const baseUri = 'https://random-data-api.com/api/v2/beers?size=100';
//   return await fetch(baseUri, { headers: { contentType: 'application/json' } })
//     .then((response) => response.json())
//     .then((data) => data);
// };
