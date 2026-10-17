function createValueChangeHandler(setValue) {
  return (event) => setValue(event.target.value);
}

function createChangeHandler(setState) {
  return (event) => {
    const { name, value } = event.target;
    setState(prev => ({ ...prev, [name]: value }));
  };
}

function createRowChangeHandler(setRows, idKey) {
  return (rowId) => (event) => {
    const { name, value } = event.target;
    setRows(prev => prev.map(row => row[idKey] === rowId ? { ...row, [name]: value } : row));
  };
}

export { createValueChangeHandler, createChangeHandler, createRowChangeHandler };
