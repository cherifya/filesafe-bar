import React from 'react';
import BridgeManager from "../lib/BridgeManager.js";
import "standard-file-js/dist/regenerator.js";
import { StandardFile, SFAbstractCrypto, SFItemTransformer } from 'standard-file-js';
import RelayManager from "../lib/RelayManager";

export default class IntegrationsView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      integrations: []
    };

    BridgeManager.get().addUpdateObserver(() => {
      this.reloadIntegrations();

      this.setState({relayServerUrl: RelayManager.get().getUrl()});
    })
  }

  reloadIntegrations() {
    let integrations = BridgeManager.get().getIntegrations();
    this.setState({
      integrations: integrations
    })
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleKeyPress = (e) => {
    if(e.key === 'Enter') {
      this.submitIntegrationCode();
    }
  }

  handleTextChange = (event) => {
    var text = event.target.value;
    this.setState({integrationCode: text});
  }

  submitIntegrationCode = () => {
    let code = this.state.integrationCode;
    if(!code || code.length == 0) {
      return;
    }
    BridgeManager.get().saveIntegration(code);
    this.setState({integrationCode: null, showInputForm: false});
    this.reloadIntegrations();
  }

  addNewIntegrationClicked = () => {
    window.open(this.state.relayServerUrl, "_blank");
    this.setState({showInputForm: true});
  }

  cancelIntegrationForm = () => {
    this.setState({showInputForm: false});
  }

  deleteIntegration = (integration) => {
    if(confirm("Are you sure you want to delete this integration?")) {
      BridgeManager.get().deleteIntegration(integration);
    }
  }

  capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    return (
      <div>
        <div className="panel-row">
          <h4>Integrations ({this.state.integrations.length})</h4>
          {!this.state.showInputForm &&
            <a className="info label" onClick={this.addNewIntegrationClicked}>Add New</a>
          }
        </div>

        <div id="integrations">
          {this.state.showInputForm &&
            <div className="notification default">
              <strong>New Integration</strong>
              <p>A new tab has opened. After you complete the authentication flow, enter the code you receive below.</p>
              <input
                className="title"
                type="text"
                placeholder={"Enter integration code"}
                value={this.state.integrationCode}
                onChange={this.handleTextChange}
                onKeyPress={this.handleKeyPress}
              />
              <div className="button-group" style={{marginTop: 10}}>
                <div className="button default">
                  <a className="" onClick={this.cancelIntegrationForm}>Cancel</a>
                </div>
                <div className="button info">
                  <a className="info label" onClick={this.submitIntegrationCode}>Submit</a>
                </div>
              </div>
            </div>
          }
        </div>

        <div>
          {this.state.integrations.map((integration) =>
            <div className="horizontal-group">
              <p><strong>{this.capitalizeFirstLetter(integration.source)}</strong></p>
              <a className="danger" onClick={() => {this.deleteIntegration(integration)}}>Delete</a>
            </div>
          )}
        </div>
      </div>
    )
  }
}
