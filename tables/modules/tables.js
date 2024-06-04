/**
 * Crea una tabla con funcionalidades de paginación, filtrado y ordenación en modo cliente
 * @param {Array} dataSource
 * @param {Number} maxCount
 * @returns {{ tableWrapper: HTMLElement, sort: () => void, filter: (filterString: String, rerender: Boolean) => void, clear: () => void }}
 */
const ClientSidePaginatedTable = (dataSource = [], maxCount = 100) => {
  let data = [...dataSource];
  const propKeys = Object.keys(data[0] ?? {});

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

  const sortState = propKeys.reduce((state, key) => {
    state[key] = 'asc';
    return state;
  }, {});

  const sort = (key) => {
    // ojo: realiza el mismo tipo de filtro para todas las propiedades
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

  const clear = () => {
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
      removeRows(tbody);
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
      removeRows(tbody);
      renderRows(tbody, data, start, maxCount);
      display.textContent = getPagerCaption(index - 1);
    }
  });

  const tfoot = table.createTFoot();
  tfoot.style.bottom = '0px';
  tfoot.style.position = 'sticky';
  tfoot.style.background = 'white';

  const footRow = tfoot.insertRow();
  footRow.style.width = '100%';

  const footerRowCell = footRow.insertCell();
  footerRowCell.colSpan = 5;
  footerRowCell.append(...[btnBack, display, btnNext]);

  return { tableWrapper, sort, filter, clear };
};

const removeRows = (tbody) => {
  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.lastChild);
  }
};

/**
 * Crea los elementos de la tabla
 * @param {HTMLTableElement} table
 * @param {Array} dataSource
 * @param {Number} start
 * @param {Number} max
 */
const renderRows = (table, dataSource = [], start = 0, max = 100) => {
  removeRows(table);
  const data = [...dataSource].slice(start, start + max);
  for (let i = 0; i < data.length; i++) {
    const propKeys = Object.keys(data[i] ?? {});
    const tableRow = table.insertRow();
    propKeys.forEach((key) => {
      const cell = tableRow.insertCell();
      cell.textContent = data[i][key];
      cell.style.height = '25px';
      cell.style.border = '1px solid lightgray';
    });
  }

  const spacingRow = table.insertRow();
  spacingRow.style.lineHeight = '0px';
};

export { ClientSidePaginatedTable };
