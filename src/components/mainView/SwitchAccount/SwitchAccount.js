import React, { Component } from "react";
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Table, Row } from "../../DataTable";
import Modal from "react-native-modalbox";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import ApiCalls from "../../../api/ApiCalls";
import { Actions } from "react-native-router-flux";
import ResourcesData from "../../../ResourcesData";
import metrics from "../../../config/metrics";
export default class SwitchAccount extends Component {
  constructor(props) {
    super(props);

  }
  close() {
    this.setState({
      isReady: false,
      modalVisible: false,
      usersDataTableData: [],
      searchText: "",
      searchUsersDataTableData: null,
    });
  }
  setModalVisible() {
    this.setState({
      modalVisible: true,
      isReady: false,
    });
    ApiCalls.getSwitchAccountUsers()
      .then((response) => {
        if (response.status != "404") {
          response.json().then((responseJson) => {
            responseJson.map((users) => {
           
              this.state.usersDataTableData.push({
                rowID: users.id,
                data: [
                  users.name,
                  users.username,
                  users.password,
                  { text: "Switch Account", type: "button" },
                ],
              });
            });
            this.setState({
              isReady: true,
              usersDataTableData: this.state.usersDataTableData,
            });
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  state = {
    isReady: false,
    modalVisible: false,
    usersDataTableData: [],
    searchUsersDataTableData: null,
  };
  searchThread = null;
  onSearchText = (text) => {
    if (text.trim() != "") {
      let filterUsersDataTableData = this.state.usersDataTableData.filter(
        (row) =>
          row.data[0].toLowerCase().includes(text.toLowerCase()) ||
          row.data[1].toLowerCase().includes(text.toLowerCase()) ||
          row.data[2].toLowerCase().includes(text.toLowerCase()) 
      );
      this.setState({ searchUsersDataTableData: filterUsersDataTableData });
    } else {
      this.setState({ searchUsersDataTableData: null });
    }
  };
  render() {
    let dataTable =
      this.state.searchUsersDataTableData != null
        ? this.state.searchUsersDataTableData
        : this.state.usersDataTableData;
    return (
      <Modal
        backdropPressToClose={false}
        swipeToClose={false}
        position="center"
        style={{
          height: metrics.DEVICE_HEIGHT - 20,
          width: metrics.DEVICE_WIDTH - 20,
        }}
        transparent={true}
        isOpen={this.state.modalVisible}
      >
        <View style={[styles.container]}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.close();
            }}
          >
            <LinearGradient
              style={styles.closeButton}
              colors={["#499cea", "#599de6", "#207ce5"]}
            >
              <Icon name="times" size={21} color="#ffffff" />
            </LinearGradient>
          </TouchableWithoutFeedback>
          {!this.state.isReady ? (
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator size="large" color="#599de6" />
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.searchContainer}>
                  <Icon name="search" size={15} color="black" />
                </View>
                <TextInput
                  key={"search"}
                  multiline={false}
                  onChangeText={(text) => {
                    this.setState({ searchText: text }, () => {
                      if (this.searchThread != null) {
                        clearTimeout(this.searchThread);
                      }
                      var this_ = this;
                      this.searchThread = setTimeout(function () {
                        this_.onSearchText(text);
                      }, 5);
                    });
                  }}
                  style={styles.searchTextInput}
                  placeholder={"Search"}
                  placeholderTextColor={"#636363"}
                  numberOfLines={1}
                  multiline={false}
                ></TextInput>
              </View>
              <ScrollView horizontal={true} style={styles.dataTableScrollView}>
                <View>
                  <Table
                    borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}
                  >
                    <Row
                     
                      data={["Name", "Username", "Password", ""]}
                      style={styles.dataTableHead}
                      textStyle={styles.dataTableHeadTextStyle}
                      widthArr={[
                        (metrics.DEVICE_WIDTH - 20) / 4,
                        (metrics.DEVICE_WIDTH - 20) / 4,
                        (metrics.DEVICE_WIDTH - 20) / 4,
                        (metrics.DEVICE_WIDTH - 20) / 4,
                    
                      ]}
                    />
                  </Table>
                  <ScrollView style={styles.dataWrapper}>
                    <Table
                      borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}
                    >
                      {dataTable.map((rowData) => {
                        return (
                          <Row
                          key={rowData.rowID}
                            onCommand={(rowID, text) => {
                              let user = this.state.usersDataTableData.find(
                                (row) => row.rowID == rowID
                              );

                              Actions.replace("MainLoginOrSignUpScreen", {
                                switchAccountDetails: {
                                  switchUser: {
                                    username: user.data[1],
                                    password: user.data[2],
                                  },
                                  loggedUser: {
                                    username:
                                      ResourcesData.MainViewScreenResources
                                        .LoginJsonData.username,
                                    password:
                                      ResourcesData.MainViewScreenResources
                                        .LoginJsonData.password,
                                  },
                                },
                              });
                            }}
                            height={35}
                            key={rowData.rowID}
                            widthArr={[
                              (metrics.DEVICE_WIDTH - 20) / 4,
                              (metrics.DEVICE_WIDTH - 20) / 4,
                              (metrics.DEVICE_WIDTH - 20) / 4,
                              (metrics.DEVICE_WIDTH - 20) / 4,
                             
                            ]}
                            rowID={rowData.rowID}
                            data={rowData.data}
                            style={[styles.dataTableRow, rowData.rowStyle]}
                            textStyle={styles.dataTableHeadTextStyle}
                          />
                        );
                      })}
                    </Table>
                  </ScrollView>
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  searchTextInput: {
    flex: 1,
    backgroundColor: "#cacaca",
    paddingLeft: 10,
  },
  loadingIndicatorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "row",
  },
  searchContainer: {
    color: "gray",
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  closeButton: {
    zIndex: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    position: "absolute",
    top: 0,
    right: 0,
  },
  dataTableScrollView: {
    flex: 1,
    backgroundColor: "#dedede",
  },

  dataTableHead: {
    height: 27,
    backgroundColor: "#DEEAFF",
  },
  dataTableRow: {
    backgroundColor: "#f1f8ff",
  },
  dataTableHeadTextStyle: {
    color: "black",
    flexWrap: "wrap",
    paddingHorizontal: 2,
    textAlign: "center",
  },
  dataTableContainer: {
    flex: 1,
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
