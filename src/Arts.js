import React, {Component} from 'react';
import Panel from 'react-bootstrap/lib/Panel'
import Button from 'react-bootstrap/lib/Button'
import CustomerDetails from './CustomerDetails'
import axios from 'axios'
import web3 from 'web3'

var abi = [{"constant":false,"inputs":[{"name":"index","type":"uint256"}],"name":"get_art_owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"get_arts_count","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"index","type":"uint256"}],"name":"get_art_description","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"index","type":"uint256"}],"name":"get_art_title","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"arts_count","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"title","type":"string"},{"name":"description","type":"string"}],"name":"create_art","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
var w3 = new web3('https://rpc.goerli.mudit.blog/');
var contract_address = "0xa8ac6b45f8eb4ce563292e1a88372aa0e75b81ff";
var contract =  new w3.eth.Contract(abi, contract_address);

export default class Arts extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedArt: 1
    }
  }

  //function which is called the first time the component loads
  async componentDidMount() {
    const response = await this.getArtData()
    console.log(response);
    this.setState({customerList: {"data":response}})
  }

  //Function to get the Art Data from json
  async getArtData() {
    var messages_count = await contract.methods.get_arts_count().call();
    var arts = []
    for(var index = 0; index < messages_count; index++){
      var title = await contract.methods.get_art_title(index).call()
      var description = await contract.methods.get_art_title(index).call()
      var owner = await  contract.methods.get_art_owner(index).call()
      arts.push({title:title,description:description,owner:owner, id:index});
    }
    return arts;
  };

  render() {
    if (!this.state.customerList)
      return (<p>Loading data</p>)
    return (<div className="addmargin">
      <div className="col-md-3">
        {

          this.state.customerList.data.map(customer => <Panel bsStyle="info" key={customer.name} className="centeralign">
            <Panel.Heading>
              <Panel.Title componentClass="h3">{customer.title}</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <p>{customer.description}</p>
              <p>{customer.address}</p>
              <Button bsStyle="info" onClick={() => this.setState({selectedArt: customer.id})}>

                Click to View Details

              </Button>

            </Panel.Body>
          </Panel>)
        }
      </div>
      <div className="col-md-6">
        <CustomerDetails val={this.state.selectedCustomer}/>
      </div>
    </div>)
  }

}

