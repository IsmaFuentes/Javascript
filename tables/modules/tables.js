/**
 * Crea una tabla con funcionalidades de paginación, filtrado y ordenación en modo cliente
 * @param {Array} dataSource Array de objetos a partir del cual generar la tabla
 * @param {Array} maxRowValues Valores máximos para el paginador
 * @returns {{ tableWrapper: HTMLElement, sort: () => void, filter: (filterString: String) => void, reset: () => void }}
 */
const CreatePaginatedTable = (
  dataSource = [],
  maxRowValues = [25, 50, 75, 100]
) => {
  let maxCount = Math.max(...maxRowValues);
  let data = [...dataSource];

  const table = document.createElement('table');
  table.style.tableLayout = 'fixed';
  table.style.height = '100%';
  table.style.minWidth = '100%';
  table.style.borderSpacing = '0px';
  table.style.fontSize = '13px';

  const tbody = table.createTBody();

  // pager display
  const display = document.createElement('label');

  const getPagerCaption = (page) => {
    const lastPage = Math.floor(data.length / maxCount);
    return `${page} ...${lastPage > 0 ? lastPage : 1}`;
  };

  display.id = 'page-display';
  display.textContent = getPagerCaption(1);
  display.style.padding = '0px 10px 0px 10px';
  display.style.background = 'white';
  display.style.textAlign = 'center';

  const propKeys = Object.keys(data[0] ?? {});

  const sortState = propKeys.reduce((state, key) => {
    state[key] = 'asc';
    return state;
  }, {});

  const sort = (key) => {
    data.sort((a, b) => {
      if (sortState[key] == 'asc') {
        return a[key] > b[key] ? -1 : 0;
      } else {
        return a[key] < b[key] ? -1 : 0;
      }
    });
    renderRows(tbody, data, 0, maxCount);
    sortState[key] = sortState[key] == 'asc' ? 'des' : 'asc';
    display.textContent = getPagerCaption(1);
  };

  const filter = (filterString) => {
    data = dataSource.filter((e) =>
      Object.values(e).some((propertyValue) =>
        propertyValue.toString().includes(filterString)
      )
    );
    renderRows(tbody, data, 0, maxCount);
    display.textContent = getPagerCaption(1);
  };

  const reset = () => {
    data = [...dataSource];
    renderRows(tbody, data, 0, maxCount);
    display.textContent = getPagerCaption(1);
  };

  const thead = table.createTHead();
  thead.style.top = '0px';
  thead.style.position = 'sticky';
  thead.style.background = 'black';
  thead.style.color = 'white';
  thead.style.height = '30px';

  const thRow = thead.insertRow();
  propKeys.forEach((key) => {
    const cell = thRow.insertCell();
    cell.textContent = `${key[0].toUpperCase()}${key.slice(1).toLowerCase()}`;
    cell.style.cursor = ' pointer';
    cell.addEventListener('click', () => sort(key));
  });

  renderRows(tbody, data, 0, maxCount);

  const tableWrapper = document.createElement('div');
  tableWrapper.style.width = '100%';
  tableWrapper.style.overflowY = 'scroll';
  tableWrapper.style.height = '100%';
  tableWrapper.appendChild(table);

  const btnNext = document.createElement('button');
  btnNext.type = 'button';
  btnNext.textContent = '>';
  btnNext.style.cursor = 'pointer';
  btnNext.addEventListener('click', () => {
    const index = parseInt(display.textContent) + 1;
    const start = maxCount * (index - 1);
    if (start < data.length) {
      renderRows(tbody, data, start, maxCount);
      display.textContent = getPagerCaption(index);
    }
  });

  const btnBack = document.createElement('button');
  btnBack.type = 'button';
  btnBack.textContent = '<';
  btnBack.style.cursor = 'pointer';
  btnBack.addEventListener('click', () => {
    const index = parseInt(display.textContent);
    if (index > 1) {
      const start = maxCount * (index - 1) - maxCount;
      renderRows(tbody, data, start, maxCount);
      display.textContent = getPagerCaption(index - 1);
    }
  });

  const maxRowCountSelector = document.createElement('select');
  maxRowCountSelector.title = 'row-selector';
  maxRowCountSelector.style.width = '75px';
  maxRowCountSelector.style.marginLeft = '5px';
  maxRowValues.forEach((max) => {
    const option = document.createElement('option');
    option.value = max;
    option.text = max;
    maxRowCountSelector.options.add(option);
  });

  maxRowCountSelector.selectedIndex = maxRowValues.length - 1;
  maxRowCountSelector.addEventListener('change', () => {
    maxCount = maxRowValues[maxRowCountSelector.selectedIndex];
    reset();
  });

  const tfoot = table.createTFoot();
  tfoot.style.bottom = '0px';
  tfoot.style.position = 'sticky';
  tfoot.style.background = 'white';

  const footRow = tfoot.insertRow();
  footRow.style.width = '100%';

  const footerRowCell = footRow.insertCell();
  footerRowCell.colSpan = propKeys.length;
  footerRowCell.append(...[btnBack, display, btnNext, maxRowCountSelector]);

  return { tableWrapper, sort, filter, reset };
};

/**
 * Crea los elementos de la tabla
 * @param {HTMLTableSectionElement} tbody
 * @param {Array} dataSource
 * @param {Number} start
 * @param {Number} max
 */
const renderRows = async (tbody, dataSource = [], start = 0, max = 100) => {
  tbody.innerHTML = '';
  // const p1 = performance.now();
  const data = [...dataSource].slice(start, start + max);
  for (let i = 0; i < data.length; i++) {
    const propKeys = Object.keys(data[i] ?? {});
    const tableRow = tbody.insertRow();
    propKeys.forEach((key) => {
      const cell = tableRow.insertCell();
      cell.textContent = data[i][key];
      cell.style.height = '25px';
      cell.style.border = '1px solid lightgray';
    });
  }
  const spacingRow = tbody.insertRow();
  spacingRow.style.lineHeight = '0px';
  // console.log('render time: ', performance.now() - p1 + 'ms');
};

// https://hrily.github.io/blog/2017/05/20/rendering-large-html-tables.html

export { CreatePaginatedTable };
