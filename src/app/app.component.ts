import { Component } from '@angular/core';

const refData = {
  India: {
    Global: ['Corporate Functions', 'Operations', 'Technology'],
    'Market Unit': ['Sales', 'Operations', 'Technology'],
    'Market Wide': ['Strategy & Consulting'],
    '': ['Sales', 'CF'],
  },
  Andorra: {
    'Market Unit': ['Technology'],
  },
  Austria: {
    Global: ['Corporate Functions', 'Operations', 'Technology'],
    'Market Unit': ['Sales', 'Operations', 'Technology'],
    'Market Wide': ['Strategy & Consulting'],
  },
  // 'United Kingdom': {
  //   London: ['Stratford', 'Cannon street', 'London Bridge'],
  //   Liverpool: ['City Centre', 'L4 Anfield', 'Everton'],
  //   Oxford: undefined,
  // },
  //Australia: undefined,
};

const columnRelationships = ['country', 'BG', 'Org'];

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  columnDefs = [
    {
      field: 'country',
      cellEditorSelector: useSelectEditorIfRefData,
      cellEditorParams: (params) => ({ values: getRefData(params) }),
      valueSetter: clearChildCells,
    },
    {
      field: 'BG',
      cellEditorSelector: useSelectEditorIfRefData,
      cellEditorParams: (params) => ({ values: getRefData(params) }),
      valueSetter: clearChildCells,
    },
    {
      field: 'Org',
      cellEditorSelector: useSelectEditorIfRefData,
      cellEditorParams: (params) => ({ values: getRefData(params) }),
      valueSetter: clearChildCells,
    },
  ];

  rowData = [
    {},
    {},
    // { country: 'Ireland', city: 'Dublin', area: 'Temple Bar' },
    // { country: 'United Kingdom', city: 'Oxford', area: '' },
    // { country: 'Australia', city: '', area: '' },
  ];

  gridOptions = {
    defaultColDef: {
      flex: 1,
      editable: true,
    },
    singleClickEdit: true,
  };
}

// getting values for the agSelectCellEditor

function getRefData(params) {
  const { field } = params.colDef;
  const { data } = params;
  alert(field);

  let currentNode = refData;

  // traversing the refData Tree
  for (let column of columnRelationships) {
    // think of location as if it is part of the path
    // ie path = /Ireland/Dublin/Temple Bar
    // ie path = /location/location/location
    // each location will navigate deeper into the tree
    const location = data[column];
    // no need to carry one beyond Parent column field
    if (column === field) break;
    // in refData few values are undefinded
    if (currentNode[location] == undefined) return [];

    currentNode = currentNode[location];
  }

  return Array.isArray(currentNode) ? currentNode : Object.keys(currentNode);
}

// value setters

function clearChildCells(params) {
  const { data, newValue } = params;
  const { field } = params.colDef;

  const cascadingColumns = columnRelationships.slice(
    columnRelationships.indexOf(field) + 1
  );

  // setting curent column value
  data[field] = newValue;

  // Clearing the following columns
  cascadingColumns.forEach((column) => {
    data[column] = '';
  });
  // return true if you would like to save the values and rerender the cells
  return true;
}

function useSelectEditorIfRefData(params) {
  return getRefData(params) != undefined
    ? { component: 'agSelectCellEditor' }
    : { component: 'agTextCellEditor' };
}
