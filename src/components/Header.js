import React, { Component } from 'react';

class Header extends Component {
    render() {
        return (
            <section id="Header">
                <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                    <a className="navbar-brand">Bot Battles</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <a className="nav-link">Home <span className="sr-only">(current)</span></a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </section>
        );
    }
}

export default Header;
