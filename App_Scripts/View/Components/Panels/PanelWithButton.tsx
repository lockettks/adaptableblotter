import * as React from "react";
import { PanelProps, Panel, Row, Col, Button, Glyphicon } from 'react-bootstrap';
import { AdaptablePopover } from '../../AdaptablePopover';
import { MessageType } from '../../../Core/Enums';
import { AdaptableBlotterForm } from "../Forms/AdaptableBlotterForm";
import * as StyleConstants from '../../../Core/Constants/StyleConstants';


export interface PanelWithButtonProps extends PanelProps {
    //use either button content + buttonClick OR button
    buttonContent?: React.ReactNode;
    buttonClick?: () => void;
    button?: React.ReactElement<any>;
    headerText: string
    glyphicon?: string
    buttonDisabled?: boolean
    buttonStyle?: string
    infoBody?: any[]
    cssClassName: string
}

//We cannot destructure this.props using the react way in typescript which is a real pain as you 
//need to transfer props individually as a consequence
//let { buttonContent, ...other } = this.props
export class PanelWithButton extends React.Component<PanelWithButtonProps, {}> {
    render() {
        let cssClassName = this.props.cssClassName + StyleConstants.ITEMS_PANEL
        let { buttonContent } = this.props
        let className = "ab_panel-with-button"
        if (this.props.className) {
            className += " " + this.props.className
        }
      //  if (buttonContent || this.props.button) {
            className += " " + "ab_panel-with-button-reduce-header-padding"
     //   }
        let buttonStyle: string = (this.props.buttonStyle) ? this.props.buttonStyle : "default"


        let header = <AdaptableBlotterForm inline>
            <Row style={{ display: "flex", alignItems: "center" }}>

                <Col xs={9}>
                    {this.props.glyphicon != null &&
                        <Glyphicon glyph={this.props.glyphicon} className="ab_large_right_margin_style" />
                    }
                    {this.props.headerText}
                    {' '}
                    {this.props.infoBody != null &&
                        <span>
                            <label>{' '}</label>
                            <span>  {' '} <AdaptablePopover cssClassName={this.props.cssClassName} headerText="" bodyText={this.props.infoBody} MessageType={MessageType.Info} /></span>
                        </span>
                    }

                </Col>
                <Col xs={3}>
                    {buttonContent &&
                        <Button bsSize="small" bsStyle={buttonStyle} disabled={this.props.buttonDisabled} onClick={() => this.props.buttonClick()} style={{ float: 'right' }}>
                            {buttonContent}
                        </Button>
                    }
                    {this.props.button && React.cloneElement(this.props.button, { style: { float: 'right' } })}
                </Col>
            </Row>
        </AdaptableBlotterForm>;
        return <div className={cssClassName}>
            <Panel header={header} className={className} style={this.props.style} bsStyle={this.props.bsStyle} >
                {this.props.children}
            </Panel>
        </div>;
    }
}


