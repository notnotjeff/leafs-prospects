const sortProspects = (prospects, sortColumn, sortDirection) => {
  prospects.sort((a, b) => {
    if (sortDirection === 'desc') {
      // Sort null values to the bottom
      if (a[sortColumn] == null) return 1
      if (b[sortColumn] == null) return -1

      if (a[sortColumn] > b[sortColumn]) return -1
      if (a[sortColumn] < b[sortColumn]) return 1
    } else {
      // Sort null values to the bottom
      if (a[sortColumn] == null) return 1
      if (b[sortColumn] == null) return -1

      if (a[sortColumn] < b[sortColumn]) return -1
      if (a[sortColumn] > b[sortColumn]) return 1
    }
    return 0
  })

  return prospects
}

const startAscendingColumns = ['last_name', 'league', 'position', 'shoots', 'draft_round', 'draft_pick']

const selectColumn = (currentColumn, currentDirection, selectedColumn, setSortColumn, setSortDirection) => {
  // If Column Already Selected Reverse Direction
  if (currentColumn === selectedColumn) {
    setSortDirection(currentDirection === 'desc' ? 'asc' : 'desc')
  }
  // If Column Is Newly Selected Sort Direction Based On Column Type
  else if (currentColumn !== selectedColumn) {
    setSortDirection(startAscendingColumns.includes(selectedColumn) ? 'asc' : 'desc')
    setSortColumn(selectedColumn)
  }
  // If Something Breaks Just Set Sort To Last Name By Default
  else {
    setSortColumn('last_name')
    setSortDirection('asc')
  }
}

export { sortProspects, selectColumn }
