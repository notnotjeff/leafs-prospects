import React, { Component } from 'react';
import './Prospects.css';
import ProspectTable from './ProspectTable';
import ProspectFilter from './ProspectFilter';

class Prospects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prospects: [],
      originalProspects: [],
      categories: [
        { name: "Name", value: "last_name" },
        { name: "League", value: "league" },
        { name: "Position", value: "position" },
        { name: "Shoots", value: "shoots"},
        { name: "Age", value: "age"},
        { name: "GP", value: "games_played"},
        { name: "G", value: "goals"},
        { name: "A", value: "assists"},
        { name: "P", value: "points"},
        { name: "S", value: "shots"},
        { name: "G/G", value: "goals_pg" },
        { name: "A/G", value: "assists_pg" },
        { name: "P/G", value: "points_pg" },
        { name: "S/G", value: "shots_pg" } ],
      sortColumn: "",
      sortDirection: "asc",
      filterCategories: ["league", "position", "shoots"],
      filter: {
        league: "Any",
        position: "Any",
        shoots: "Any"
      }
    }
    this.sortColumn = this.sortColumn.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch('/prospects')
      .then(res => res.json())
      .then(prospects => {
        this.setState({ prospects, originalProspects: prospects });
      });
  }

  sortColumn(columnName) {
    var sortDirection = this.state.sortDirection;
    var sortColumn = this.state.sortColumn;

    if (sortColumn === columnName) {
      if (sortDirection === "desc") {
        sortDirection = "asc";
      } else {
        sortDirection = "desc";
      }
    } else if (sortColumn !== columnName && (columnName === "last_name" || columnName === "league" || columnName === "position" || columnName === "shoots")) {
      sortDirection = "asc";
    }
    else {
      sortDirection = "desc";
    }

    let sortProspects = this.state.prospects.sort((a, b) => {
      if (sortDirection === "desc") {
        if (a[columnName] > b[columnName]) return -1;
        if (a[columnName] < b[columnName]) return 1;
      } else {
        if (a[columnName] < b[columnName]) return -1;
        if (a[columnName] > b[columnName]) return 1;
      }
      if (columnName !== "last_name") {
        if (a.last_name < b.last_name) return -1;
        if (a.last_name > b.last_name) return 1;
      }
      return 0;
    });

    this.setState({ prospects: sortProspects, sortColumn: columnName, sortDirection: sortDirection });
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  handleChange(e) {
    this.setState({filter: { ...this.state.filter, [e.target.name]: e.target.value}}, () => {
      let {filter, filterCategories} = this.state;

      let prospects = this.state.originalProspects.filter(p => {
        let fail = false;
        filterCategories.forEach(f => {
          if (filter[f] !== p[f] && filter[f] !== "Any") {
            fail = true;
            // Exceptions for grouping positions/Canadian hockey leagues
            if (f === "position" && filter[f] === "F") {
              if (p[f] === "C" || p[f] === "LW" || p[f] === "RW" || p[f] === "LW/RW") { fail = false }
            }
            if (f === "position" && filter[f] === "W") {
              if (p[f] === "LW" || p[f] === "RW" || p[f] === "LW/RW") { fail = false }
            }
            if (f === "league" && filter[f] === "CHL") {
              if (p[f] === "OHL" || p[f] === "QMJHL" || p[f] === "WHL") { fail = false }
            }
          }
        });
        return fail !== true;
      });

      this.setState({ prospects });
    });
  }

  render() {
    let {prospects, categories} = this.state;
    return (
      <div className="prospects-container">
        <ProspectFilter handleSubmit={this.handleSubmit} handleChange={this.handleChange} />
        <ProspectTable
          prospects={prospects}
          categories={categories}
          sortColumn={this.sortColumn}
         />
      </div>
    );
  }
}

export default Prospects;
