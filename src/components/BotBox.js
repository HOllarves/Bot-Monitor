import React, { Component } from 'react';
import { Card, CardText, CardImg, CardImgOverlay } from 'reactstrap';
import './BotBox.css';
import NumberFormat from 'react-number-format';

class BotBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: props.bot.currency + " - " + props.bot.asset,
            depth: props.bot.depth,
            status: props.bot.status ? props.bot.status : 0,
            balance: props.bot.balance,
            pic: props.bot.pic,
            currency: props.bot.currency,
            alpha: props.bot.alpha,
            longed: props.bot.longed
        }
    }

    /**
     * React Lifecycle
     * @param {*} nextProps 
     * @param {*} prevState 
     */
    static getDerivedStateFromProps(props, prevState) {
        return {
            name: props.bot.currency + " - " + props.bot.asset,
            depth: props.bot.depth,
            status: props.bot.status ? props.bot.status : 0,
            balance: props.bot.balance,
            pic: props.bot.pic,
            currency: props.bot.currency,
            alpha: props.bot.alpha,
            longed: props.bot.longed
        }
    }
    /**
     * Renders the component
     */
    render() {
        // Style variables
        let positive_color = "#02ea02",
            negative_color = "#577bff";


        // Setting correct format for balance type
        let balance = {};
        if (this.state.currency === "BTC") {
            balance = <NumberFormat
                value={this.state.balance}
                displayType={'text'}
                decimalScale={3} prefix={'BTC '}
                renderText={value => <p style={{ color: this.state.balance >= 0 ? positive_color : negative_color }} className="corner-element bottom-right"> {value} </p>}>
            </NumberFormat>
        } else {
            balance = <NumberFormat
                value={this.state.balance}
                displayType={'text'}
                decimalScale={2} prefix={'$ '}
                renderText={value => <p style={{ color: this.state.balance >= 0 ? positive_color : negative_color }} className="corner-element bottom-right"> {value} </p>}>
            </NumberFormat>
        }
        return (
            <div className="bot-container col-md-4">
                <Card inverse>
                    <CardImg width="100%" src={this.state.pic} alt="Card image cap" />
                    <CardImgOverlay className={this.state.longed ? "bot-longed" : null}>
                        <CardText className="corner-element top-right">{this.state.depth}</CardText>
                        {balance}
                        <NumberFormat value={this.state.alpha} displayType={'text'} decimalScale={2} renderText={value => <p className="center-element"> {value} </p>}></NumberFormat>
                        <CardText className="corner-element top-left"> {this.state.name} </CardText>
                        <NumberFormat value={this.state.status} displayType={'text'} decimalScale={2} prefix={'% '} renderText={value => <p style={{ color: this.state.status >= 0 ? positive_color : negative_color }} className="corner-element bottom-left"> {value} </p>}></NumberFormat>
                    </CardImgOverlay>
                </Card>
            </div>
        );
    }
}

export default BotBox;
