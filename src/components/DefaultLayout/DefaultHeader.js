import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
} from "reactstrap";
import PropTypes from "prop-types";

import { AppNavbarBrand, AppSidebarToggler } from "@coreui/react";
import logo from "../../assets/img/brand/logo-mini.png";
import sygnet from "../../assets/img/brand/sygnet.svg";
import { Auth } from "../../firebase";

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

const DefaultHeader = (props) => {
  const auth = useContext(Auth);

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
              <p className="title-user" style={{ textTransform: "capitalize" }}>
                {console.log(auth.sesion)}
                {auth.sesion ? auth.sesion.role : ""}
              </p>
              <i className="icon-user"></i>
            </div>
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem header tag="div" className="text-center">
              <strong>Opciones</strong>
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
              <Link to="/usuarios" className="nav-link">
                Personal
              </Link>
            </DropdownItem>

            <DropdownItem>
              <Link to="/config" className="nav-link">
                Config
              </Link>
            </DropdownItem>
            <DropdownItem header tag="div" className="text-center">
              <strong>Cuenta</strong>
            </DropdownItem>
            <DropdownItem>
              <Link to="/perfil" className="nav-link">
                <i className="fa fa-user"></i> Perfil
              </Link>
            </DropdownItem>
            <DropdownItem onClick={(e) => props.onLogout(e)}>
              <Link to="/login" className="nav-link">
                <i className="fa fa-lock"></i> Cerrar sesión
              </Link>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    </React.Fragment>
  );
};

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
