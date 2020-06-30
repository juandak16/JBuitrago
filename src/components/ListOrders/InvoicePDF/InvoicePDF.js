import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
//import ProductRowResumen from "../ProductRowResumen/ProductRowResumen";
import {
  Image,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import Logo from "../../../assets/img/brand/logo.png";
import Encabezado from "../../../assets/img/brand/encabezado.jpeg";

const styles = StyleSheet.create({
  encabezado: {},
  document: {
    height: "500px",
  },
  page: {
    flexDirection: "column",
    backgroundColor: "white",
    position: "relative",
    minHeight: "100vh",
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
  section: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    flexGrow: 0,
  },
  infoOrder: {
    display: "flex",
    flexDirection: "column",
  },
  textBold: {
    fontWeight: "bold",
    fontWeight: 800,
    fontSize: 12,
    padding: 5,
  },
  text: {
    fontSize: 12,
    padding: 5,
    textTransform: "uppercase",
  },
  dateOrder: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    fontSize: 14,
  },
  clientDir: {
    display: "flex",
    flexDirection: "column",
    fontSize: 12,
  },
  rifPay: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
    fontSize: 12,
  },
  capitalize: {
    textTransform: "capitalize",
  },
  typeList: {
    textAlign: "center",
    backgroundColor: "yellow",
  },
  tab: {
    flexGrow: 0,
    border: 1,
  },
  headerTab: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 12,
    borderTop: 1,
  },
  rowTab: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 12,
    borderTop: 1,
  },
  titleTab: {
    position: "relative",
    textAlign: "center",
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 10,
    borderRight: 1,
  },
  textTab: {
    position: "relative",
    paddingTop: 2,
    paddingBottom: 2,
    textAlign: "center",
    textTransform: "capitalize",
    borderRight: 1,
    fontSize: 10,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  tabFooter: {
    position: "relative",
    border: 1,
  },
  rowFooter: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: 1,
  },
  textTabFooter: {
    padding: 5,
    paddingBottom: 2,
    paddingTop: 2,
    textAlign: "center",
    borderRight: 1,
    fontSize: 10,
  },
});

const InvoicePDF = (props) => {
  const { order } = props;
  const {
    client,
    date,
    detail_orders,
    id,
    iva_order,
    status_order,
    subtotal_order,
    total_order,
    type_list_id,
    type_list,
    type_pay,
    user,
  } = order;
  const timestamp = order.date ? new Date(date) : null;

  const getDate = (timestamp) => {
    let stringDate;
    let stringMonth;
    let stringDay;
    if (timestamp) {
      let date = timestamp.getDate();
      let month = timestamp.getMonth();
      let year = timestamp.getFullYear();
      month < 10
        ? (stringMonth = "0" + (month + 1))
        : (stringMonth = month + 1);
      date < 10 ? (stringDay = "0" + date) : (stringDay = date);
      stringDate = stringDay + "/" + stringMonth + "/" + year;
      //stringDate = date + "/" + (month + 1) + "/" + year;
      return stringDate;
    }
    return null;
  };

  return (
    <PDFViewer style={styles.document}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section} fixed>
            <Image src={Encabezado} style={styles.encabezado} />
            <View style={styles.infoOrder}>
              <View style={styles.dateOrder}>
                <View style={{ ...styles.row, border: 1 }}>
                  <Text style={{ ...styles.textBold, borderRight: 1 }}>
                    FECHA:
                  </Text>
                  <Text style={styles.text}>{getDate(timestamp)}</Text>
                </View>
                <View style={{ ...styles.row, border: 1 }}>
                  <Text style={{ ...styles.textBold, borderRight: 1 }}>
                    PEDIDO Nro:
                  </Text>
                  <Text style={styles.text}>#{id}</Text>
                </View>
              </View>
              <View style={styles.clientDir}>
                <View style={styles.row}>
                  <Text style={styles.textBold}>CLIENTE: </Text>
                  <Text style={styles.text}>{client.name}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.textBold}>DIRECCIÓN: </Text>
                  <Text style={styles.text}>{client.address}</Text>
                </View>
              </View>
              <View style={styles.rifPay}>
                <View style={styles.row}>
                  <Text style={styles.textBold}>RIF: </Text>
                  <Text style={styles.text}>
                    {client.rif_type}-{client.rif_number}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.textBold}>TIPO DE PAGO: </Text>
                  <Text style={styles.text}>{type_pay.name}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.textBold}>VENDEDOR: </Text>
                  <Text style={styles.text}>{user.name}</Text>
                </View>
              </View>
              <View style={styles.typeList}>
                <Text style={{ ...styles.text, fontSize: 16 }}>
                  {type_list.name}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ ...styles.section, paddingTop: 0 }}>
            <View style={styles.tab}>
              <View style={styles.headerTab} fixed>
                <Text style={{ ...styles.titleTab, width: "13%" }}>CÓDIGO</Text>
                <Text style={{ ...styles.titleTab, width: "50%" }}>
                  DESCRIPCIÓN
                </Text>
                <Text style={{ ...styles.titleTab, width: "11%" }}>CANT</Text>
                <Text style={{ ...styles.titleTab, width: "13%" }}>PRECIO</Text>
                <Text style={{ ...styles.titleTab, width: "13%" }}>TOTAL</Text>
              </View>
              {console.log(detail_orders)}
              {detail_orders.map((item, index) => {
                return (
                  <View key={index} style={styles.rowTab}>
                    <Text style={{ ...styles.textTab, width: "13%" }}>
                      {item.product.code}
                    </Text>
                    <Text style={{ ...styles.textTab, width: "50%" }}>
                      {item.product.description}
                    </Text>
                    <Text style={{ ...styles.textTab, width: "11%" }}>
                      {item.count}
                    </Text>
                    <Text style={{ ...styles.textTab, width: "13%" }}>
                      {item.product.price.toFixed(2)}
                    </Text>
                    <Text style={{ ...styles.textTab, width: "13%" }}>
                      {item.total.toFixed(2)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
          <View style={styles.footer} fixed>
            <View style={styles.tabFooter}>
              <View style={styles.rowFooter}>
                <Text style={{ ...styles.textTabFooter, width: "20%" }}>
                  EMBALADO POR
                </Text>
                <View style={{ ...styles.textTabFooter, width: "50%" }}></View>
                <Text style={{ ...styles.textTabFooter, width: "15%" }}>
                  SUBTOTAL
                </Text>
                <Text style={{ ...styles.textTabFooter, width: "15%" }}>
                  {subtotal_order.toFixed(2)}
                </Text>
              </View>

              <View style={styles.rowFooter}>
                <Text style={{ ...styles.textTabFooter, width: "20%" }}>
                  FECHA
                </Text>
                <View style={{ ...styles.textTabFooter, width: "17%" }}></View>
                <Text style={{ ...styles.textTabFooter, width: "16%" }}>
                  HORA
                </Text>
                <View style={{ ...styles.textTabFooter, width: "17%" }}></View>

                <Text style={{ ...styles.textTabFooter, width: "15%" }}>
                  IVA
                </Text>
                <Text style={{ ...styles.textTabFooter, width: "15%" }}>
                  {type_list_id === 2 ? iva_order.toFixed(2) : "0,00"}
                </Text>
              </View>
              <View style={styles.rowFooter}>
                <Text style={{ ...styles.textTabFooter, width: "20%" }}>
                  PESO
                </Text>
                <View style={{ ...styles.textTabFooter, width: "17%" }}></View>
                <Text style={{ ...styles.textTabFooter, width: "16%" }}>
                  BULTOS
                </Text>
                <View style={{ ...styles.textTabFooter, width: "17%" }}></View>
                <Text style={{ ...styles.textTabFooter, width: "15%" }}>
                  TOTAL
                </Text>
                <Text style={{ ...styles.textTabFooter, width: "15%" }}>
                  {total_order.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default InvoicePDF;
