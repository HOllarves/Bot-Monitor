import React, { Component } from 'react';
import './Header.css';

class Header extends Component {
    render() {
        return (
            <section id="Header">
                <nav className="navbar navbar-expand-md fixed-top">
                    <a className="navbar-brand">Thriven Bot Battles</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </nav>
            </section>
        );
    }
}

export default Header;
