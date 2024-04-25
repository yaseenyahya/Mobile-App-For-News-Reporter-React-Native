import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  FlatList,

  ActivityIndicator
} from "react-native";
import Ripple from "react-native-material-ripple";
import { View } from "react-native-animatable";
import Includes from "../../Includes";
import ApiCalls from "../../api/ApiCalls";
import SafeAreaView from "react-native-safe-area-view";
import ResourcesData from "../../ResourcesData";
import ReadMore from "./ReadMore";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import { Actions } from "react-native-router-flux";
import CalendarPicker from "react-native-calendar-picker";
import { showSnackBar } from "../../SnackBar";
import MediaPlayerModal from "./MediaPlayerModal";
import { LinearGradient } from "expo-linear-gradient";
import ClipboardToast from "../ClipboardToast";
export default class HistoryView extends Component {
  collapsedCallbackReturn = null;
  constructor(props) {
    super(props);

    this.state = {
      reportsDataSource: [],
      selectedStartDate: moment(),
      selectedEndDate: null,
      isCalenderVisible: false,
      isLoading: false
    };
  }
  stopCalls = false;
  componentWillUnmount() {
    this.stopCalls = true;
  }
  componentDidMount() {
    this.getReportHistory(
      this.state.selectedStartDate,
      this.state.selectedEndDate
    );
  }
  getFilename(url) {
    if (url) {
      var m = url.toString().substring(url.lastIndexOf("/") + 1);
      if (m && m.length > 1) {
        return m;
      }
    }
    return "";
  }
  getReportHistory(fromDate, toDate) {
    this.setState({ isLoading: true });

    ApiCalls.getReportsByUsernamePassword(
      ResourcesData.MainViewScreenResources.LoginJsonData.username,
      ResourcesData.MainViewScreenResources.LoginJsonData.password,
      fromDate.format("MM-DD-YYYY"),
      toDate == null
        ? fromDate.format("MM-DD-YYYY")
        : toDate.format("MM-DD-YYYY")
    )
      .then(response => {
        if (response.status == "200") {
          var responseJsonSerialized = [];
          response.json().then(responseJson => {
            responseJson.map((item, index) => {
              if (item.uploadfileserilize.length > 0) {
                var uploadFilesJson = JSON.parse(item.uploadfileserilize);
                item.uploadfileserilize = [];
                uploadFilesJson.map((uploadfile, index) => {
                  item.uploadfileserilize.push({
                    fileName: this.getFilename(uploadfile),
                    fileSource: uploadfile
                  });
                });
              }
              responseJsonSerialized.push(item);
            });
            this.setState({ reportsDataSource: responseJsonSerialized }, () => {
              this.setState({ isLoading: false });
            });
          });


        } else {
          this.setState({ isLoading: false });
        }
      })
      .catch(error => {
        Includes.resolveErrorMessage(error.message).then(errorMessage => {
          showSnackBar({
            message: errorMessage,
            position: "top",
            confirmText: "OK",
            backgroundColor: "#c62828",
            textColor: "white",
            duration: 6000
          });

          let this_ = this;
          if (!this.stopCalls) {
            setTimeout(() => {

              this_.getReportHistory(fromDate, toDate);
            }, 10000);
          }
        });
      });
  }
  onDateChange = (date, type) => {
    if (type === "END_DATE") {
      this.setState({
        selectedEndDate: date
      });
    } else {
      this.setState({
        selectedStartDate: date,
        selectedEndDate: null
      });
    }
  };
  _toggleCalender = () => {
    this.setState({ isCalenderVisible: !this.state.isCalenderVisible });
  };
  _onBackPress = () => {
    Actions.pop();
  };
  _showMedia = uploadFiles => {
    this.MediaPlayerModal.setModalVisible(uploadFiles, null);
  };
  _renderContentTruncatedFooter = handlePress => {
    return (
      <Text style={{ color: "#499cea", marginTop: 5 }} onPress={handlePress}>
        Read more
      </Text>
    );
  };

  _renderContentRevealedFooter = handlePress => {
    return (
      <Text style={{ color: "#499cea", marginTop: 5 }} onPress={handlePress}>
        Show less
      </Text>
    );
  };


  render() {

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Ripple
            rippleCentered={true}
            style={styles.headerBackBtnContainer}
            onPress={() => {
              this._onBackPress();
            }}
          >
            <Icon name="arrow-left" size={30} color="#ffffff" />
          </Ripple>
          <Text style={{ color: "white", fontSize: 24, fontWeight: "700" }}>
            {"Reports History"}
          </Text>
          <Ripple
            rippleCentered={true}
            style={styles.headerCalenderToggleBtn}
            onPress={() => {
              this._toggleCalender();
            }}
          >
            <Icon
              name={this.state.isCalenderVisible ? "times" : "search"}
              size={30}
              color="#ffffff"
            />
          </Ripple>
        </View>
        {this.state.isCalenderVisible && (
          <View style={{ backgroundColor: "white" }}>
            <CalendarPicker
              startFromMonday={true}
              allowRangeSelection={true}
              maxDate={new Date()}
              selectedStartDate={this.state.selectedStartDate}
              todayBackgroundColor="#f2e6ff"
              selectedDayColor="#499cea"
              selectedDayTextColor="#FFFFFF"
              onDateChange={this.onDateChange}
            />
            <Ripple
              style={styles.goSearchBtnContainer}
              onPress={() => {
                this.getReportHistory(
                  this.state.selectedStartDate,
                  this.state.selectedEndDate
                );
                this.setState({ isCalenderVisible: false });
              }}
            >
              <Text style={{ color: "white", fontSize: 20 }}>
                Click Here To Search
              </Text>
            </Ripple>
          </View>
        )}

        {this.state.isLoading && (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator size={60} color="#599de6" />
          </View>
        )}
        {!this.state.isLoading && (
          this.state.reportsDataSource.length == 0 ?
            <Text style={{ paddingHorizontal: 5, paddingVertical: 10, fontSize: 20 }}>No result found</Text>
            :
            <FlatList
            ref={(ref)=>{
              this.flatListRef = ref;
            }}
              style={{ marginTop: 8 }}
              data={this.state.reportsDataSource}
              renderItem={({ item,index }) => {

                return <View style={{ marginTop: 2 }}>
                  <LinearGradient
                    style={{
                      flex: 1,
                      height: 23,
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                    colors={["#F98902", "#F98902"]}
                  >
                    <Ripple
                      onPress={() => {
                        this._showMedia(item.uploadfileserilize);
                      }}
                      style={styles.flatListHeaderItemShowMediaBtn}
                    >
                      <Icon name="paperclip" size={15} color="#ffffff" />
                      <Text
                        style={{
                          color: "white",
                          fontSize: 18,
                          fontWeight: "700",
                          marginLeft: 2
                        }}
                      >
                        {item.uploadfileserilize.length}
                      </Text>
                    </Ripple>

                    <Text
                      numberOfLines={1}
                      style={{
                        color: "white",
                        fontSize: 16,

                        fontWeight: "700",
                        paddingLeft: 5
                      }}
                    >
                      {item.subject}
                    </Text>
                  </LinearGradient>

                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        paddingLeft: 2,
                        textAlign: "right",
                        backgroundColor: "white",
                        color: "black",
                        paddingVertical: 2,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: "black"
                      }}
                    >
                      {item.date + " " + item.time}
                    </Text>
                  
                      <View style={{marginRight:5,marginTop:5,marginLeft:5,paddingBottom:25}}>
                     
                        <ReadMore
                        animate={true}
                          numberOfLines={3}
                          allowFontScaling={false}
                          ellipsis={""}
                          collapsedCallbackReturn={(collapsedCallback)=>{
                            if( this.collapsedCallbackReturn != null){
                            this.collapsedCallbackReturn()
                            var indexToScroll = index == 0 ? 0 :index - 1;
                            setTimeout(()=>{
                              this.flatListRef.scrollToIndex({animated:false,index:indexToScroll});
                            },100)
                           
                            }
                              this.collapsedCallbackReturn = collapsedCallback;
                            }}
                          seeMoreContainerStyleSecondary={{ position:"absolute",bottom:-23,left:0 }}
                        >
                          {item.slug}
                        </ReadMore>
                        <ClipboardToast textStyle={{}} toastPosition={'bottom'} showIcon={false}
                          textToShow="Copy"
                          toastDelay={1000} textToCopy={item.slug} containerStyle={{ paddingVertical: 2,paddingHorizontal:4, opacity: 0.7, backgroundColor: "#b1b1b1",position:"absolute",bottom:0,right:0 }} />
                      </View>
                    </View>
             
                </View>
              }}
              ItemSeparatorComponent={({ leadingItem, section }) => {
                return <View style={styles.separator}></View>;
              }}
            />
        )}
        <MediaPlayerModal
          ref={ref => {
            this.MediaPlayerModal = ref;
          }}
        ></MediaPlayerModal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#8E8E8E"
  },
  headerContainer: {
    flexDirection: "row",
    height: 80,
    backgroundColor: "#d32f2f",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerBackBtnContainer: {
    padding: 10,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center"
  },
  headerCalenderToggleBtn: {
    padding: 10,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center"
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: "center"
  },
  goSearchBtnContainer: {
    alignItems: "center",
    padding: 7,
    justifyContent: "center",
    backgroundColor: "#d32f2f"
  },
  flatListHeaderItemContainer: {
    flexDirection: "row",

    alignItems: "center",
    flex: 1
  },
  flatListHeaderItemShowMediaBtn: {
    flexDirection: "row",
    backgroundColor: "#499cea",
    alignSelf: "stretch",
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center"
  }
});
