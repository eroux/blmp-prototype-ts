import React from 'react'
import Footer from './Footer'
import NodeShape from './NodeShape'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'
import * as rdf from 'rdflib'

interface AppState {
	loading: boolean,
	data: string
}

class App extends React.Component<{}, AppState> {

  constructor(props :any) {
    super(props);
    this.state = {
      loading: true,
      data: ''
    };
  }

  printStore(s: rdf.Store) {
  	let defaultRef = new rdf.NamedNode(rdf.Store.defaultGraphURI)
  	rdf.serialize(defaultRef, s, undefined, 'text/turtle', function(err, str) { console.log(str); });
  }

  async loadTtl(url: string): Promise<rdf.Store> {
    const response = await fetch(url);
    const body = await response.text();
    let store: rdf.Store = rdf.graph();
	rdf.parse(body, store, rdf.Store.defaultGraphURI, 'text/turtle');
    return store;
  }

  async componentDidMount() {
    this.setState({ loading: true });
    let store = await this.loadTtl("proto/type-sh.ttl")
    let data = await this.loadTtl("proto/type-sh.ttl")
    this.setState({ loading: false });
    this.printStore(store)
  }

  render() {
  	if (this.state.loading) {
      return <h2>Loading...</h2>;
    }
    return <div><NodeShape/></div>;
  }
}

export default App