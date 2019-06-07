import React, { Component } from 'react';
import './App.css'

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
const PARAM_PAGE = 'page=';

//Styling area
const largeColumn = {width:'40%',};
const midColumn = {width:'30%',};
const smallColumn = {width:'10%'};

function isSearched(searchTerm)
{
  return (item)=>item.title.toLowerCase().includes(searchTerm.toLowerCase());
}

class App extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      result:null,
      searchTerm: DEFAULT_QUERY,
    };
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  }
  fetchSearchTopStories(searchTerm) {
      fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
    }
  componentDidMount()
  {
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm)
  }
  setSearchTopStories(result)
  {
    this.setState({result});

  }
  onDismiss(id)
  {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: { ...this.state.result, hits: updatedHits }
    });
  }

  onSearchChange(event)
  {
    this.setState({ searchTerm: event.target.value });
    this.fetchSearchTopStories(this.state.searchTerm)
    event.preventDefault();
  }
  render(){
    const { searchTerm, result } = this.state;
    if (!result) { return null; }
    return (
        <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            >
            Search
          </Search>
        </div>
        { result?<Table
            list={result.hits}
            pattern={searchTerm}
            onDismiss={this.onDismiss}
          />: null
      }
      </div>
  );
  }
}

const Table = ({list,pattern,onDismiss})=>
      <div className="table">
        {list.map(item=>
        <div key={item.objectID} className="table-row">
          <span style={largeColumn}>
              <a href={item.url}>{item.title}</a>
          </span><br/>
          <span style={midColumn}>{item.author}</span><br/>
          <span style={smallColumn}>{item.num_comments}</span><br/>
          <span style={smallColumn}>{item.points}</span><br/>
          <span>
          <Button className="button-inline" onClick={()=>onDismiss(item.objectID)}>
                Dismiss
          </Button>
          </span>
        </div>
        )}
      </div>

const Search = ({ value, onChange, children })=>
      <form>
        {children}
        <input
          type="text"
          value={value}
          onChange={onChange}
        />
      </form>

const Button = ({onClick,className="",children})=>
      <button
        onClick={onClick}
        className={className}
        type="button"
      >
        {children}
      </button>
export default App;
