import React, { Component, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Button,
  Nav,
  NavItem,
} from "reactstrap";
import PropTypes from "prop-types";

import { AppNavbarBrand, AppSidebarToggler } from "@coreui/react";
import logo from "../../assets/img/brand/logo-mini.png";
import sygnet from "../../assets/img/brand/sygnet.svg";

import CrudItem from "../../components/Items/CrudItem/CrudItem";

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <Nav className="mr-auto d-lg-none" navbar>
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <AppSidebarToggler className="d-lg-none" display="md" mobile />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                <Link to="/notaentrega" className="nav-link">
                  Nota de Entrega
                </Link>
              </DropdownItem>

              <DropdownItem>
                <Link to="/facturafiscal" className="nav-link">
                  Factura Fiscal
                </Link>
              </DropdownItem>
              <DropdownItem>
                <Link to="/pedidosne" className="nav-link">
                  Pedidos NE
                </Link>
              </DropdownItem>
              <DropdownItem>
                <Link to="/pedidosff" className="nav-link">
                  Pedidos FF
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>

        <AppNavbarBrand
          full={{ src: logo, width: 70, height: 40, alt: "CoreUI Logo" }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: "CoreUI Logo" }}
        />

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink to="/notaentrega" className="nav-link">
              Nota de Entrega
            </NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink to="/facturafiscal" className="nav-link">
              Factura Fiscal
            </NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink to="/pedidosne" className="nav-link">
              Pedidos NE
            </NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink to="/pedidosff" className="nav-link">
              Pedidos FF
            </NavLink>
          </NavItem>
        </Nav>

        <Nav className="ml-auto" navbar>
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <div className="account-nav">
                <p className="title-user">Admin</p>
                <i className="icon-user"></i>
              </div>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem header tag="div" className="text-center">
                <strong>Settings</strong>
              </DropdownItem>
              <DropdownItem>
                <Link to="/productos" className="nav-link">
                  Productos
                </Link>
              </DropdownItem>
              <DropdownItem>
                <Link to="/clientes" className="nav-link">
                  Clientes
                </Link>
              </DropdownItem>
              <DropdownItem>
                <Link to="/users" className="nav-link">
                  Personal
                </Link>
              </DropdownItem>
              <DropdownItem header tag="div" className="text-center">
                <strong>Account</strong>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-user"></i> Profile
              </DropdownItem>
              <DropdownItem onClick={(e) => this.props.onLogout(e)}>
                <Link to="/login" className="nav-link">
                  <i className="fa fa-lock"></i> Logout
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
