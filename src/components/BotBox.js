import React, { Component } from 'react';
import { Card, CardText, CardImg, CardImgOverlay } from 'reactstrap';
import './BotBox.css';

class BotBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: this.props.bot.currency + " - " + this.props.bot.asset,
            depth: this.props.bot.depth,
            status: this.props.bot.status,
            balance: this.props.bot.balance,
            pic: this.props.bot.pic
        }
    }

    render() {
        return (
            <div className="botContainer col-md-4">
                <Card inverse>
                    <CardImg width="100%" src={this.state.pic} alt="Card image cap" />
                    <CardImgOverlay>
                        <CardText className="cornerElement topRight">{this.state.depth}</CardText>
                        <CardText className="cornerElement bottomRight"> {this.state.balance} </CardText>
                        <CardText className="cornerElement topLeft"> {this.state.name} </CardText>
                        <CardText className="cornerElement bottomLeft"> {this.state.status} </CardText>
                    </CardImgOverlay>
                </Card>
            </div>
        );
    }
}

export default BotBox;
