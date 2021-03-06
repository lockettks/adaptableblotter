import * as React from "react";
import { ButtonBase, ButtonProps } from './ButtonBase'
import * as StyleConstants from '../../../Core/Constants/StyleConstants';

export class ButtonPreviewDelete extends React.Component<ButtonProps, {}> {
    render() {
        return <ButtonBase ToolTipAndText=""
            bsStyle={this.props.bsStyle}
            bsSize={this.props.size}
            ConfigEntity={this.props.ConfigEntity}
            glyph={"trash"}
            onClick={() => this.props.onClick()}
            overrideDisableButton={this.props.overrideDisableButton}
            overrideTooltip={this.props.overrideTooltip}
            style={this.props.style}
            DisplayMode={this.props.DisplayMode}
            overrideText={this.props.overrideText}
            cssClassName={this.props.cssClassName + StyleConstants.PREVIEW_DELETE_ITEM_BUTTON}
            hideToolTip={true}
        />;
    }
}

