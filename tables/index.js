import { createPaginatedTable } from './modules/tables.js';

window.onload = () => {
  const container = document.querySelector('#tables');
  getData().then((data) => {
    const { tableWrapper, filter, clear } = createPaginatedTable(data, 100);
    container.append(tableWrapper);

    document
      .querySelector('#filter-input')
      .addEventListener('keyup', function (e) {
        console.log(this.value.length);
        if (this.value.length >= 3) {
          filter(this.value, true);
        } else if (this.value.length == 0) {
          clear();
        }
      });

    document.querySelector('#clear-submit').addEventListener('click', clear);
  });
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
