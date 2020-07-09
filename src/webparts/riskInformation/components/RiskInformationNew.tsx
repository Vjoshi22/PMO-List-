import * as React from 'react';
import styles from './RiskInformation.module.scss';
import { IRiskInformationProps } from './IRiskInformationProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient, ISPHttpClientOptions, SPHttpClientConfiguration, SPHttpClientResponse } from "@microsoft/sp-http";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { GetParameterValues } from './getQueryString';
import { Form, FormGroup, Button, FormControl } from "react-bootstrap";
import { SPComponentLoader } from "@microsoft/sp-loader";
import { IRiskInformationWebPartProps } from "../RiskInformationWebPart";
import * as $ from "jquery";
import { getListEntityName,listType } from './getListEntityName';
import { ISPRiskInformationFields } from './IRiskInformationFileds';
import { IRiskInformationState } from './IRiskInformationState';

require('./RiskInformation.module.scss');
SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.css");

let timerID;
let newitem: boolean;
let listGUID: any = "b94d8766-9e5a-41ae-afc6-b00a0bbe0149"; // Risk Information

export default class RiskInformationNew extends React.Component<IRiskInformationProps, IRiskInformationState> {
  constructor(props: IRiskInformationProps, state: IRiskInformationState) {
    super(props);
    this.state = {
      Title: "",
      RiskId: -1,
      ProjectID: "",
      RiskName: "",
      RiskDescription: "",
      RiskCategory: "",
      RiskIdentifiedOn: "",
      RiskClosedOn: null,
      RiskStatus: "",
      RiskOwner: "",
      RiskResponse: "",
      RiskImpact: "",
      RiskProbability: "",
      RiskRank: "",
      Remarks: "",
      focusedInput: "",
      FormDigestValue: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public componentDidMount() {
    getListEntityName(this.props.currentContext, listGUID);
    //Load dd, people picker and other controls    
    this.setFormDigest();
    timerID = setInterval(
      () => this.setFormDigest(), 300000);
  }

  //For React form controls
  private handleChange = (e) => {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  private handleSubmit = (e) =>{    
      this.createItem(e);
  }
  public render(): React.ReactElement<IRiskInformationProps> {

    SPComponentLoader.loadCss("//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css");
    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.7.14/js/bootstrap-datetimepicker.min.js");
    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.4.1/css/bootstrap-datepicker3.css");

    return (
      <div id="newItemDiv" className={styles["_main-div"]} >
        <div id="heading" className={styles.heading}><h5>Risk Details</h5></div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Row className="mt-3">
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel + " " + styles.required}>Project ID</Form.Label>
            </FormGroup>
            <FormGroup className="col-3">
              {/* <Form.Control size="sm" type="text" disabled={this.state.disable_RMSID} id="_RMSID" name="RMS_Id" placeholder="RMS ID" onChange={this.handleChange} value={this.state.RMS_Id} /> */}
              <Form.Control size="sm" type="text" id="ProjectId" name="ProjectID" placeholder="Project ID" onChange={this.handleChange} value={this.state.ProjectID} />
            </FormGroup>
            <FormGroup className="col-1"></FormGroup>
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel + " " + styles.required}>Risk Category</Form.Label>
            </FormGroup>
            <FormGroup className="col-3">
              <Form.Control size="sm" id="RiskCategory" as="select" name="RiskCategory" onChange={this.handleChange} value={this.state.RiskCategory}>
                <option >Select an Option</option>
                <option value="Resources">Resources</option>
                <option value="Technology">Technology</option>
                <option value="Requirements">Requirements</option>
                <option value="Quality">Quality</option>
                <option value="External">External</option>
                <option value="Scope">Scope</option>
                <option value="Schedule">Schedule</option>
                <option value="Budget">Budget</option>
              </Form.Control>
            </FormGroup>
          </Form.Row>
          <Form.Row>
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel + " " + styles.required}>Risk Name</Form.Label>
            </FormGroup>
            <FormGroup className="col-9 mb-3">
              <Form.Control size="sm" type="text" id="RiskName" name="RiskName" placeholder="Risk Name" onChange={this.handleChange} value={this.state.RiskName} />
            </FormGroup>
          </Form.Row>

          <Form.Row>
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel + " " + styles.required}>Risk Description</Form.Label>
            </FormGroup>
            <FormGroup className="col-9 mb-3">
              <Form.Control size="sm" as="textarea" rows={3} type="text" id="RiskDescription" name="RiskDescription" placeholder="Risk Description" onChange={this.handleChange} value={this.state.RiskDescription} />
            </FormGroup>
          </Form.Row>

          <Form.Row>
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel + " " + styles.required}>Risk Identified On</Form.Label>
            </FormGroup>
            <FormGroup className="col-3">
              <Form.Control size="sm" type="date" id="RiskIdentifiedOn" name="RiskIdentifiedOn" placeholder="Risk Identified On" onChange={this.handleChange} value={this.state.RiskIdentifiedOn} />
              {/* <DatePicker selected={this.state.PlannedStart}  onChange={this.handleChange} />; */}
            </FormGroup>
            <FormGroup className="col-1"></FormGroup>
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel}>Risk Closed On</Form.Label>
            </FormGroup>
            <FormGroup className="col-3">
              <Form.Control size="sm" type="date" id="RiskClosedOn" name="RiskClosedOn" placeholder="Risk Closed On" onChange={this.handleChange} value={this.state.RiskClosedOn} />
            </FormGroup>
          </Form.Row>

          <Form.Row>
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel + " " + styles.required}>Risk Response</Form.Label>
            </FormGroup>
            <FormGroup className="col-3">
              <Form.Control size="sm" id="RiskResponse" as="select" name="RiskResponse" onChange={this.handleChange} value={this.state.RiskResponse}>
                <option >Select an Option</option>
                <option value="Accept">Accept</option>
                <option value="Avoid">Avoid</option>
                <option value="Mitigate">Mitigate</option>
                <option value="Transfer">Transfer</option>
              </Form.Control>
            </FormGroup>
            <FormGroup className="col-1"></FormGroup>
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel + " " + styles.required}>Risk Impact</Form.Label>
            </FormGroup>
            <FormGroup className="col-3">
              <Form.Control size="sm" id="RiskImpact" as="select" name="RiskImpact" onChange={this.handleChange} value={this.state.RiskImpact}>
                <option >Select an Option</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </Form.Control>
            </FormGroup>
          </Form.Row>

          <Form.Row>
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel + " " + styles.required}>Risk Status</Form.Label>
            </FormGroup>
            <FormGroup className="col-3">
              <Form.Control size="sm" id="RiskStatus" as="select" name="RiskStatus" onChange={this.handleChange} value={this.state.RiskStatus}>
                <option >Select an Option</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </Form.Control>
            </FormGroup>
            <FormGroup className="col-1"></FormGroup>
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel + " " + styles.required}>Risk Owner</Form.Label>
            </FormGroup>
            <FormGroup className="col-3">
              {/* <Form.Control size="sm" type="text" disabled={this.state.disable_RMSID} id="_RMSID" name="RMS_Id" placeholder="RMS ID" onChange={this.handleChange} value={this.state.RMS_Id} /> */}
              <Form.Control size="sm" type="text" id="RiskOwner" name="RiskOwner" placeholder="Risk Owner" onChange={this.handleChange} value={this.state.RiskOwner} />
            </FormGroup>
          </Form.Row>

          <Form.Row>
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel + " " + styles.required}>Risk Probability</Form.Label>
            </FormGroup>
            <FormGroup className="col-3">
              <Form.Control size="sm" id="RiskProbability" as="select" name="RiskProbability" onChange={this.handleChange} value={this.state.RiskProbability}>
                <option >Select an Option</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </Form.Control>
            </FormGroup>
            <FormGroup className="col-1"></FormGroup>
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel}>Risk Rank</Form.Label>
            </FormGroup>
            <FormGroup className="col-3">
              {/* <Form.Control size="sm" type="text" disabled={this.state.disable_RMSID} id="_RMSID" name="RMS_Id" placeholder="RMS ID" onChange={this.handleChange} value={this.state.RMS_Id} /> */}
              <Form.Control size="sm" type="text" id="RiskRank" name="RiskRank" placeholder="Risk Rank" onChange={this.handleChange} value={this.state.RiskRank} />
            </FormGroup>
          </Form.Row>

          <Form.Row>
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel + " " + styles.required}>Remarks</Form.Label>
            </FormGroup>
            <FormGroup className="col-9 mb-3">
              <Form.Control size="sm" as="textarea" rows={3} type="text" id="Remarks" name="Remarks" placeholder="Remarks" onChange={this.handleChange} value={this.state.Remarks} />
            </FormGroup>
          </Form.Row>

          <Form.Row className={styles.buttonCLass}>
            <FormGroup></FormGroup>
            <div>
              <Button id="submit" size="sm" variant="primary" type="submit">
                Submit
              </Button>
            </div>
            <FormGroup className="col-.5"></FormGroup>
            <div>
              <Button id="cancel" size="sm" variant="primary" onClick={() => { this.closeform() }}>
                Cancel
              </Button>
            </div>
            {/* <div>
              <Button id="reset" size="sm" variant="primary" onClick={this.resetform}>
                Reset
              </Button>
            </div> */}
          </Form.Row>
        </Form>
      </div >
    );
  }

  private createItem(e){
    let _validate = 0;
    e.preventDefault();
    let requestData = {
      __metadata:
      {
        type: listType
      },
      ProjectID: this.state.ProjectID,
      RiskName: this.state.RiskName,
      RiskDescription: this.state.RiskDescription,
      RiskCategory: this.state.RiskCategory,
      RiskIdentifiedOn: this.state.RiskIdentifiedOn,
      RiskClosedOn: this.state.RiskClosedOn,
      RiskStatus: this.state.RiskStatus,
      RiskOwner: this.state.RiskOwner,
      RiskResponse: this.state.RiskResponse,
      RiskImpact: this.state.RiskImpact,
      RiskProbability: this.state.RiskProbability,
      Remarks: this.state.Remarks,
      RiskRank: this.state.RiskRank
    } as ISPRiskInformationFields;

    //validation
    // if (requestData.ProjectID.length < 1) {
    //   $('input[name="RMS_Id"]').css('border', '2px solid red');
    //   _validate++;
    // } else {
    //   $('input[name="RMS_Id"]').css('border', '1px solid #ced4da')
    // }
    // if (requestData.ProjectID_SalesCRM.length < 1) {
    //   $('input[name="CRM_Id"]').css('border', '2px solid red');
    //   _validate++;
    // } else {
    //   $('input[name="CRM_Id"]').css('border', '1px solid #ced4da')
    // }
    // if (requestData.ProjectName.length < 1) {
    //   $('#_projectName').css('border', '2px solid red');
    //   _validate++;
    // } else {
    //   $('#_projectName').css('border', '1px solid #ced4da')
    // }
    // if (requestData.PlannedStart.length < 1) {
    //   $('#inpt_plannedStart').css('border', '2px solid red');
    //   _validate++;
    // } else {
    //   $('#inpt_plannedStart').css('border', '1px solid #ced4da');
    // }
    // if (requestData.PlannedCompletion.length < 1) {
    //   $('#inpt_plannedCompletion').css('border', '2px solid red');
    //   _validate++;
    // } else {
    //   $('#inpt_plannedCompletion').css('border', '1px solid #ced4da');
    // }
    // if (requestData.ProjectBudget.length < 1) {
    //   $('#_budget').css('border', '2px solid red');
    //   _validate++;
    // } else {
    //   $('#_budget').css('border', '1px solid #ced4da')
    // }
    // if (_validate > 0) {
    //   return false;
    // }

    $.ajax({
      url: `${this.props.currentContext.pageContext.web.absoluteUrl}/_api/web/lists('${listGUID}')/items`,
      type: "POST",
      data: JSON.stringify(requestData),
      headers:
      {
        "Accept": "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        "X-RequestDigest": this.state.FormDigestValue,
        "IF-MATCH": "*",
        'X-HTTP-Method': 'POST'
      },
      success: (data, status, xhr) => {
        console.log("Submitted successfully");
        alert("Submitted successfully");
        // let winURL = 'https://ytpl.sharepoint.com/sites/yashpmo/SitePages/Projects.aspx';
        // window.open(winURL, '_self');
      },
      error: (xhr, status, error) => {
        alert(JSON.stringify(xhr.responseText));
        console.log(xhr.responseText + " | " + error);
        // let winURL = 'https://ytpl.sharepoint.com/sites/yashpmo/SitePages/Projects.aspx';
        // window.open(winURL, '_self');
      }
    });

    // this.state = {
    //   Title: "",
    //   RiskId: -1,
    //   ProjectID: "",
    //   RiskName: "",
    //   RiskDescription: "",
    //   RiskCategory: "",
    //   RiskIdentifiedOn: "",
    //   RiskClosedOn: null,
    //   RiskStatus: "",
    //   RiskOwner: "",
    //   RiskResponse: "",
    //   RiskImpact: "",
    //   RiskProbability: "",
    //   RiskRank: "",
    //   Remarks: "",
    //   focusedInput: "",
    //   FormDigestValue: ""
    // };
  }

  private setFormDigest
  (){
    $.ajax({  
        url: this.props.currentContext.pageContext.web.absoluteUrl+"/_api/contextinfo",  
        type: "POST",  
        headers:{'Accept': 'application/json; odata=verbose;', "Content-Type": "application/json;odata=verbose",  
      },  
        success: (resultData)=> {  
          
          this.setState({  
            FormDigestValue: resultData.d.GetContextWebInformation.FormDigestValue
          });  
        },  
        error : (jqXHR, textStatus, errorThrown) =>{  
        }  
    });  
  }

  private closeform() {
    let winURL = 'https://ytpl.sharepoint.com/sites/yashpmo/';
    this.state = {
      Title: "",
      RiskId: -1,
      ProjectID: "",
      RiskName: "",
      RiskDescription: "",
      RiskCategory: "",
      RiskIdentifiedOn: "",
      RiskClosedOn: null,
      RiskStatus: "",
      RiskOwner: "",
      RiskResponse: "",
      RiskImpact: "",
      RiskProbability: "",
      RiskRank: "",
      Remarks: "",
      focusedInput: "",
      FormDigestValue: ""
    };
    window.open(winURL, '_self');
  }
  // private loadItem(){

  //   var itemId = GetParameterValues('id');
  //   const url = this.props.currentContext.pageContext.web.absoluteUrl + `/_api/web/lists(' ${listGUID} ')/items( ${itemId} )`;
  //   return this.props.currentContext.spHttpClient.get(url,SPHttpClient.configurations.v1,  
  //       {  
  //           headers: {  
  //             'Accept': 'application/json;odata=nometadata',  
  //             'odata-version': ''  
  //           }  
  //       }).then((response: SPHttpClientResponse): Promise<I> => {  
  //           return response.json();  
  //         })  
  //       .then((item: ISPRiskInformationFields): void => {   
  //         this.state = {
  //           Title: ,
  //           RiskId: -1,
  //           ProjectID: "",
  //           RiskName: "",
  //           RiskDescription: "",
  //           RiskCategory: "",
  //           RiskIdentifiedOn: "",
  //           RiskClosedOn: "",
  //           RiskStatus: "",
  //           RiskOwner: "",
  //           RiskResponse: "",
  //           RiskImpact: "",
  //           RiskProbability: "",
  //           RiskRank: "",
  //           Remarks: "",
  //           focusedInput: "",
  //           FormDigestValue: ""
  //         })  
  //         //console.log(this.state.) ;
  //       });
  //   }
}
