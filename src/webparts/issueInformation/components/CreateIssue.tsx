import * as React from 'react';
//import styles from './IssueInformation.module.scss';
import { IIssueInformationProps } from './IIssueInformationProps';
import { escape } from '@microsoft/sp-lodash-subset';
//extra imports
import { SPHttpClient, ISPHttpClientOptions, SPHttpClientConfiguration  ,SPHttpClientResponse, HttpClientResponse} from "@microsoft/sp-http";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker"; 
import { _getParameterValues } from '../../PMOListForms/components/getQueryString';
import styles from '../../PMOListForms/components/PmoListForms.module.scss';
import { Form, FormGroup, Button, FormControl } from "react-bootstrap";
import { SPComponentLoader } from "@microsoft/sp-loader";
import { SPCreateIssueForm } from "./ICreateIssueColumnFields";
import * as $ from "jquery";
import { _getListEntityName, listType } from '../../PMOListForms/components/getListEntityName';

//declaring state
export interface ICreateIssueState{
  ProjectID: string;
  IssueCategory: string;
  IssueDescription: string;
  NextStepsOrResolution: string;
  IssueStatus: string;
  IssuePriority: string;
  Assignedteam: string;
  Assginedperson: string;
  IssueReportedOn: string;
  IssueClosedOn: string;
  RequiredDate: string;
  FormDigestValue: string;
}
//declaring variables
var listGUID: any = "373C7C3-3379-49C9-B3B1-AC87C2166DC0";   //"47272d1e-57d9-447e-9cfd-4cff76241a93"; 
var timerID;
var allchoiceColumns: any[] = ["IssueCategory", "IssueStatus", "IssuePriority"]

export default class CreateIssue extends React.Component<IIssueInformationProps, ICreateIssueState> {
  constructor(props: IIssueInformationProps, state: ICreateIssueState) {  
    super(props);  
  
    this.state = {
      ProjectID: '',
      IssueCategory: '',
      IssueDescription: '',
      NextStepsOrResolution: '',
      IssueStatus: '',
      IssuePriority: '',
      Assignedteam: '',
      Assginedperson: '',
      IssueReportedOn: '',
      IssueClosedOn: '',
      RequiredDate: '',
      FormDigestValue:''
    }
  }
//loading function when page gets loaded
public componentDidMount() {
  $('.webPartContainer').hide();
  allchoiceColumns.forEach(elem => {
    this.retrieveAllChoicesFromListField(this.props.currentContext.pageContext.web.absoluteUrl, elem);
  })
  _getListEntityName(this.props.currentContext, listGUID);
  // $('.pickerText_4fe0caaf').css('border','0px');
  // $('.pickerInput_4fe0caaf').addClass('form-control');
  $('.form-row').css('justify-content','center');
  
  this.getAccessToken();
  timerID=setInterval(
    () =>this.getAccessToken(),300000); 
}
private handleChange(e){

}
private handleSubmit(e){

}
  public render(): React.ReactElement<IIssueInformationProps> {
    SPComponentLoader.loadCss("//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css");
    return (
      <div id="newItemDiv" className={styles["_main-div"]} >
        <div id="heading" className={styles.heading}><h3>Register an Issue</h3></div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Row className="mt-3">
            {/*-----------RMS ID------------------- */}
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel +" " + styles.required}>Project Id</Form.Label>
            </FormGroup>
            <FormGroup className="col-3">
              <Form.Control size="sm" type="number" id="ProjectId" name="ProjectID" placeholder="Project ID" onChange={this.handleChange} value={this.state.ProjectID}/>
            </FormGroup>
            <FormGroup className="col-6"></FormGroup>
          </Form.Row>
          {/* --------ROW 2----------------- */}
          <Form.Row className="mt-3">
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel +" " + styles.required}>Issue Category</Form.Label>
            </FormGroup>
            <FormGroup className="col-3">
              <Form.Control size="sm" type="number" id="IssueCategory" name="IssueCategory" placeholder="Issue Category" onChange={this.handleChange} value={this.state.IssueCategory}/>
            </FormGroup>
            <FormGroup className="col-1"></FormGroup>
          </Form.Row>
          {/* ---------ROW 3---------------- */}
          <Form.Row className="mt-3">
            {/*-----------Issue Status------------------- */}
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel +" " + styles.required}>Issue Status</Form.Label>
            </FormGroup>
            <FormGroup className="col-3">
              <Form.Control size="sm" as="select" id="IssueStatus" name="IssueStatus" placeholder="Issue Status" onChange={this.handleChange} value={this.state.IssueStatus}/>
            </FormGroup>
            <FormGroup className="col-1"></FormGroup>
            {/*-----------Issue Priority------------- */}
            <FormGroup className="col-2">
                <Form.Label className={styles.customlabel + " " + styles.required}>IssuePriority</Form.Label>
              </FormGroup>
              <FormGroup className="col-3">
                <Form.Control size="sm" id="IssuePriority" as="select" name="IssuePriority" onChange={this.handleChange} value={this.state.IssuePriority}>
                  <option value="">Select an Option</option>
                </Form.Control>
              </FormGroup>
          </Form.Row>
          {/* ---------ROW 4---------------- */}
          <Form.Row className="mt-3">
            {/*-----------Issue Status------------------- */}
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel +" " + styles.required}>Assigned Team</Form.Label>
            </FormGroup>
            <FormGroup className="col-3">
              <Form.Control size="sm" type="text" id="Assignedteam" name="Assignedteam" placeholder="Assigned Team" onChange={this.handleChange} value={this.state.Assignedteam}/>
            </FormGroup>
            <FormGroup className="col-1"></FormGroup>
            {/*-----------Issue Priority------------- */}
            <FormGroup className="col-2">
                <Form.Label className={styles.customlabel + " " + styles.required}>Assgined Person</Form.Label>
              </FormGroup>
              <FormGroup className="col-3">
                <Form.Control size="sm" id="Assginedperson" type="text" name="Assginedperson" onChange={this.handleChange} value={this.state.Assginedperson}/>
              </FormGroup>
          </Form.Row>
           {/* ---------ROW 4---------------- */}
           <Form.Row className="mt-3">
            {/*-----------Issue Status------------------- */}
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel +" " + styles.required}>Issue Reported On</Form.Label>
            </FormGroup>
            <FormGroup className="col-3">
              <Form.Control size="sm" type="text" id="IssueReportedOn" name="IssueReportedOn" onChange={this.handleChange} value={this.state.IssueReportedOn}/>
            </FormGroup>
            <FormGroup className="col-1"></FormGroup>
            {/*-----------Issue Priority------------- */}
            <FormGroup className="col-2">
                <Form.Label className={styles.customlabel + " " + styles.required}>Issue Closed On</Form.Label>
              </FormGroup>
              <FormGroup className="col-3">
                <Form.Control size="sm" id="IssueClosedOn" type="text" name="IssueClosedOn" onChange={this.handleChange} value={this.state.IssueClosedOn}/>
              </FormGroup>
          </Form.Row>
          {/* ---------ROW 5---------------- */}
          <Form.Row className="mt-3">
            {/*-----------Issue Status------------------- */}
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel +" " + styles.required}>Issue Reported On</Form.Label>
            </FormGroup>
            <FormGroup className="col-3">
              <Form.Control size="sm" type="text" id="IssueReportedOn" name="IssueReportedOn" onChange={this.handleChange} value={this.state.IssueReportedOn}/>
            </FormGroup>
            <FormGroup className="col-1"></FormGroup>
          </Form.Row>
          {/* ---------ROW 4---------------- */}
          <Form.Row className="mt-3">
            {/*-----------Issue Status------------------- */}
            <FormGroup className="col-2">
              <Form.Label className={styles.customlabel +" " + styles.required}>Issue Description</Form.Label>
            </FormGroup>
            <FormGroup className="col-3">
              <Form.Control size="sm" type="text" id="IssueDescription" name="IssueDescription" placeholder="Description about the Issue" onChange={this.handleChange} value={this.state.IssueDescription}/>
            </FormGroup>
            <FormGroup className="col-1"></FormGroup>
            {/*-----------Issue Priority------------- */}
            <FormGroup className="col-2">
                <Form.Label className={styles.customlabel + " " + styles.required}>Issue Closed On</Form.Label>
              </FormGroup>
              <FormGroup className="col-3">
                <Form.Control size="sm" id="NextStepsOrResolution" type="text" name="NextStepsOrResolution" placeholder="Next Steps and Resolutions for the Issue" onChange={this.handleChange} value={this.state.NextStepsOrResolution}/>
              </FormGroup>
          </Form.Row>
        </Form>
      </div>
    );
  }
  //function to get the choice column values
  private retrieveAllChoicesFromListField(siteColUrl: string, columnName: string): void {
      const endPoint: string = `${siteColUrl}/_api/web/lists('`+ listGUID +`')/fields?$filter=EntityPropertyName eq '`+ columnName +`'`;
  
      this.props.currentContext.spHttpClient.get(endPoint, SPHttpClient.configurations.v1)
      .then((response: HttpClientResponse) => {
        if (response.ok) {
          response.json()
            .then((jsonResponse) => {
              console.log(jsonResponse.value[0]);
              let dropdownId = jsonResponse.value[0].Title.replace(/\s/g, '');
              jsonResponse.value[0].Choices.forEach(dropdownValue => {
                $('#' + dropdownId ).append('<option value="'+ dropdownValue +'">'+ dropdownValue +'</option>');
              });
            }, (err: any): void => {
              console.warn(`Failed to fulfill Promise\r\n\t${err}`);
            });
        } else {
          console.warn(`List Field interrogation failed; likely to do with interrogation of the incorrect listdata.svc end-point.`);
        }
      });
  }
  //function to keep the request digest token active
  private getAccessToken(){
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
}
