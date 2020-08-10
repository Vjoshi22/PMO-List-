import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart,WebPartContext } from '@microsoft/sp-webpart-base';

import * as strings from 'RiskInformationWebPartStrings';
import RiskInformationNew from './components/RiskInformationNew';
import RiskInformationEdit from './components/RiskInformationEdit';
import { IRiskInformationProps } from './components/IRiskInformationProps';

export interface IRiskInformationWebPartProps {
  description: string;
  currentContext: WebPartContext;
  customGridRequired: string;
  listGUID:string;
  ProjectMasterGUID:string;
}

export var allchoiceColumns: any[] = ["RiskCategory", "RiskStatus", "RiskResponse", "RiskImpact", "RiskProbability"];

export default class RiskInformationWebPart extends BaseClientSideWebPart <IRiskInformationWebPartProps> {

  public render(): void {
    let renderPMOForm: any;
    if((/edit/.test(window.location.href))){
      renderPMOForm = RiskInformationEdit 
    }
    if((/new/.test(window.location.href))){
      renderPMOForm = RiskInformationNew
    }
    const element: React.ReactElement<IRiskInformationProps> = React.createElement(
      renderPMOForm,
      {
        description: this.properties.description,
        currentContext: this.context,
        customGridRequired: this.properties.customGridRequired,
        listGUID:this.properties.listGUID,
        ProjectMasterGUID:this.properties.ProjectMasterGUID
      }
    );
    ReactDom.render(element, this.domElement);    
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }
  
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('listGUID', {
                  label: 'Enter the list GUID'
                }),
                PropertyPaneTextField('ProjectMasterGUID', {
                  label: 'Enter the Project Master GUID'
                })
              ]
            },
            {
              groupName: "Custom Grid",
              groupFields: [
                PropertyPaneToggle('customGridRequired', {
                  label: "Custom Grid Required"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
