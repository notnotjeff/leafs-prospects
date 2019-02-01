import React, { Component } from 'react';
import './Prospects.css';
import firebase from './firebase.js';
import ProspectTable from './ProspectTable';
import ProspectFilter from './ProspectFilter';

class Prospects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prospects: [],
      originalProspects: [],
      categories: [
        { name: "Name", value: "last_name", title: "Name" },
        { name: "League", value: "league", title: "League" },
        { name: "POS", value: "position", title: "Position" },
        { name: "H", value: "shoots", title: "Handedness" },
        { name: "Age", value: "age", title: "Age" },
        { name: "DY", value: "draft_year", title: "Draft Year" },
        { name: "RD", value: "round", title: "Draft Round" },
        { name: "Pick", value: "pick", title: "Overall Pick Number" },
        { name: "GP", value: "games_played", title: "Games Played" },
        { name: "G", value: "goals", title: "Goals" },
        { name: "A", value: "assists", title: "Assists" },
        { name: "P", value: "points", title: "Points" },
        { name: "S", value: "shots", title: "Shots" },
        { name: "G/G", value: "goals_pg", title: "Goals per Game" },
        { name: "A/G", value: "assists_pg", title: "Assists per Game" },
        { name: "P/G", value: "points_pg", title: "Points per Game" },
        { name: "S/G", value: "shots_pg", title: "Shots per Game" } ],
      sortColumn: "",
      sortDirection: "asc",
      startAscendingColumns: ["last_name", "league", "position", "shoots", "round", "pick"],
      filterCategories: ["league", "position", "shoots", "round", "draft_year"],
      filter: {
        league: "Any",
        position: "Any",
        shoots: "Any",
        round: "Any",
        draft_year: "Any"
      },
      updatedAt: ""
    }
  }

  componentDidMount() {
    const prospectsRef = firebase.database().ref('prospects');
    const timeRef = firebase.database().ref('prospectsScrapedTime');

    timeRef.on('value', (snapshot) => {
      let time = "";
      snapshot.forEach(snap => {
        time = String(snap.val().updatedAt);
      });
      
      this.setState({updatedAt: time})
    });

    prospectsRef.on('value', (snapshot) => {
      let prospects = [];
      snapshot.forEach(snap => {
        prospects.push(snap.val());
      });
      
      this.setState({ prospects, originalProspects: prospects });
      this.sortColumn("points_pg");
    });
  }

  sortColumn = (columnName) => {
    var sortColumn = this.state.sortColumn;
    var sortDirection;
    
    // If Column Already Selected Reverse Direction
    if (sortColumn === columnName){
      this.state.sortDirection === "desc" ? sortDirection = "asc" : sortDirection = "desc";
    }
    // If Column Is Newly Selected Sort Direction Based On Column Type
    else if (sortColumn !== columnName) {
      this.state.startAscendingColumns.includes(columnName) ? sortDirection = "asc" : sortDirection = "desc";
    }
    // If Something Breaks Just Set Sort To Last Name By Default
    else {
      sortColumn = "last_name";
      sortDirection = "asc"
    }

    // Sort Prospects Array Based On Column And Direction Selected
    let sortProspects = this.state.prospects.sort((a, b) => { 
      if (sortDirection === "desc") {
        // Sort null values to the bottom
        if (a[columnName] == null) return 1;
        if (b[columnName] == null) return -1;
        
        if (a[columnName] > b[columnName]) return -1;
        if (a[columnName] < b[columnName]) return 1;
      } else {
        // Sort null values to the bottom
        if (a[columnName] == null) return 1;
        if (b[columnName] == null) return -1;
        
        if (a[columnName] < b[columnName]) return -1;
        if (a[columnName] > b[columnName]) return 1;
      }
      return 0;
    });

    this.setState({ prospects: sortProspects, sortColumn: columnName, sortDirection: sortDirection });
  }

  handleSubmit = (e) => {
    e.preventDefault();
  }

  handleChange = (e) => {
    this.setState({filter: { ...this.state.filter, [e.target.name]: e.target.value}}, () => {
      let {filter, filterCategories} = this.state;

      let prospects = this.state.originalProspects.filter(p => {
        let fail = false;
        filterCategories.forEach(f => {
          if (f === "round" && filter[f] !== "Any") { 
            if (filter[f] === "Undrafted" && p[f] !== undefined) { 
              fail = true;
            } else if (+p[f] !== +filter[f] && filter[f] !== "Undrafted") { 
              fail = true;
            }
          } 
          else if (f === "draft_year" && filter[f] !== "Any") {
            if (filter[f] === "Undrafted" && p[f] !== undefined) { 
              fail = true;
            } else if (+p[f] !== +filter[f] && filter[f] !== "Undrafted") { 
              fail = true;
            }
          }
          else if (filter[f] !== p[f] && filter[f] !== "Any") {
            if (f === "position" && filter[f] === "F") {
              if (p[f] !== "C" && p[f] !== "LW" && p[f] !== "RW" && p[f] !== "W") { fail = true }
            }
            else if (f === "position" && filter[f] === "W") {
              if (p[f] !== "LW" && p[f] !== "RW" && p[f] !== "W") { fail = true }
            }
            else if (f === "position" && filter[f] === "LW") {
              if (p[f] !== "LW" && p[f] !== "W") { fail = true }
            }
            else if (f === "position" && filter[f] === "RW") {
              if (p[f] !== "RW" && p[f] !== "W") { fail = true }
            }
            else if (f === "league" && filter[f] === "CHL") {
              if (p[f] !== "OHL" && p[f] !== "QMJHL" && p[f] !== "WHL") { fail = true }
            }
            else if (f === "league" && filter[f] === "North American") {
              if (p[f] !== "OHL" && p[f] !== "QMJHL" && p[f] !== "WHL" && p[f] !== "AHL" && p[f] !== "ECHL" && p[f] !== "USHL" && p[f] !== "NCAA") { fail = true }
            }
            else if (f === "league" && filter[f] === "European") {
              if (p[f] !== "KHL" && p[f] !== "MHL" && p[f] !== "VHL" && p[f] !== "Liiga" && p[f] !== "SHL" && p[f]) { fail = true }
            }
            else {
              fail = true;
            }
          }
        });
        return fail !== true;
      });

      this.setState({ prospects });
    });
  }

  render() {
    let {prospects, categories, updatedAt} = this.state;
    let data = <div className="loading">Collecting data...</div>;
    if (this.state.originalProspects.length !== 0) {
      data = (
        <div className="prospects-container">
          <ProspectFilter handleSubmit={this.handleSubmit} handleChange={this.handleChange} />
          <ProspectTable
            prospects={prospects}
            categories={categories}
            sortColumn={this.sortColumn}
            sortedColumn={this.state.sortColumn}
          />
        </div>
     )
    }

    let updatedDiv = updatedAt === "" ? (<div className="updated-container"></div>) : (<div className="updated-container">Updated at: {updatedAt} EST</div>)

    return (
      <section>
        {data}
        <div className="updated-container">
          {updatedDiv}
        </div>
      </section>
    );
  }
}

export default Prospects;
