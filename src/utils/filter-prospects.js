const filterProspects = (initialProspects = [], filters) => {
  const filterCategories = ['league', 'position', 'shoots', 'draft_round', 'draft_year']
  const filteredProspects = initialProspects.filter(p => {
    let fail = false
    filterCategories.forEach(f => {
      if (f === 'draft_round' && filters[f] !== 'Any') {
        if (filters[f] === 'Undrafted' && p[f] !== undefined) {
          fail = true
        } else if (+p[f] !== +filters[f] && filters[f] !== 'Undrafted') {
          fail = true
        }
      } else if (f === 'draft_year' && filters[f] !== 'Any') {
        if (filters[f] === 'Undrafted' && p[f] !== undefined) {
          fail = true
        } else if (+p[f] !== +filters[f] && filters[f] !== 'Undrafted') {
          fail = true
        }
      } else if (filters[f] !== p[f] && filters[f] !== 'Any') {
        if (f === 'position' && filters[f] === 'F') {
          if (!['C', 'LW', 'RW', 'W'].includes(p[f])) {
            fail = true
          }
        } else if (f === 'position' && filters[f] === 'W') {
          if (!['LW', 'RW', 'W'].includes(p[f])) {
            fail = true
          }
        } else if (f === 'position' && filters[f] === 'LW') {
          if (p[f] !== 'LW' && p[f] !== 'W') {
            fail = true
          }
        } else if (f === 'position' && filters[f] === 'RW') {
          if (p[f] !== 'RW' && p[f] !== 'W') {
            fail = true
          }
        } else if (f === 'league' && filters[f] === 'CHL') {
          if (['OHL', 'QMJHL', 'WHL'].includes(p[f])) {
            fail = true
          }
        } else if (f === 'league' && filters[f] === 'North American') {
          if (['OHL', 'QMJHL', 'WHL', 'AHL', 'ECHL', 'USHL', 'NCAA'].includes(p[f])) {
            fail = true
          }
        } else if (f === 'league' && filters[f] === 'European') {
          if (['KHL', 'MHL', 'VHL', 'Liiga', 'SHL', 'Mestis', 'NLA'].includes(p[f])) {
            fail = true
          }
        } else {
          fail = true
        }
      }
    })
    return fail !== true
  })

  return filteredProspects
}

export { filterProspects }
