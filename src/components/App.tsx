import React from 'react'
import Footer from './Footer'
import NodeShape from './NodeShape'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'
import * as rdf from 'rdflib'
import { NamedNode as NN } from 'rdflib'
import { RDFResource } from '../lib/types'
import * as ns from '../lib/ns'

interface AppState {
	loading: boolean,
	rootShape?: RDFResource,
  rootResource?: RDFResource
}

class App extends React.Component<{}, AppState> {

  constructor(props :any) {
    super(props);
    this.state = {
      loading: true
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
    let shStore = await this.loadTtl("proto/type-sh.ttl")
    let dataStore = await this.loadTtl("proto/data.ttl")
    let rootShape: RDFResource = {
    	"node": ns.BDS('EntityShape'),
    	"store": shStore
    }
    let rootResource: RDFResource = {
      "node": ns.BDR('R01'),
      "store": dataStore
    }
    this.setState({ loading: false, rootShape: rootShape, rootResource: rootResource });
  }

  render() {
  	if (this.state.loading) {
      return <h2>Loading...</h2>;
    }
    return <div><NodeShape shape={this.state.rootShape} resource={this.state.rootResource}/></div>;
  }
}

export default App