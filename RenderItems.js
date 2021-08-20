import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions
} from 'react-native';
import styles from '../DashboardStyles';
import Immutable from 'seamless-immutable';
import { Icon } from 'react-native-elements';

const moment = require('moment');

const RenderItem = props => {
  const clickedReset = (item, actionType, index) => {
    let modifiedResponse = Immutable.asMutable(props.actualData, {
      deep: true
    });

    if (modifiedResponse && modifiedResponse.length > 0) {
      modifiedResponse.filter(value => {
        let selectedNumber = item && item.id;
        let actualNumber = value && value.id;
        if (actualNumber === selectedNumber) {
          if ((value && value.nextLabel) === actionType) {
            value.notStarted = true;
            value.inProgress = false;
            value.isCompleted = false;
            value.finishedTime = '00:00';
            value.numberOfTasksFinished = 0;
            if (
              value &&
              value.order_details &&
              value.order_details.length > 0
            ) {
              value.order_details.map((val, i) => {
                val.startTime = '00:00';
                val.inProgress = false;
                val.endTime = '00:00';
                val.isCompleted = false;
              });
            }
          }

          props.oderUpdateCall(value);
        }
      });
    }
    props.modifiyResponse(modifiedResponse);
  };
  const timeDifference = (startTime, endTime) => {
    /// capturing the start time and end time of the task..then check for the difference
    let differenceTime = moment(endTime).diff(startTime);
    var day, hour, minute, seconds;
    //converting the milliseconds to required format below
    seconds = Math.floor(differenceTime / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;

    let finalhours = (hour < 10 ? '0' : '') + hour;
    let finalMinutes = (minute < 10 ? '0' : '') + minute;
    let finalSeconds = (seconds < 10 ? '0' : '') + seconds;
    /// finally returing the time in hh:mm format
    return finalMinutes + ':' + finalSeconds;
  };
  // Add two times in hh:mm format
  function addTimes(timeOne, timeTwo) {
    var t1 = timeOne;
    var t2 = timeTwo;

    t1 = t1.split(/\D/);
    t2 = t2.split(/\D/);
    // var x1 = parseInt(t1[0]) * 60 * 60 + parseInt(t1[1]) * 60 + parseInt(t1[2]);
    // var x2 = parseInt(t2[0]) * 60 * 60 + parseInt(t2[1]) * 60 + parseInt(t2[2]);
    var x1 = parseInt(t1[0]) * 60 + parseInt(t1[1]);
    var x2 = parseInt(t2[0]) * 60 + parseInt(t2[1]);

    var s = x1 + x2;
    var m = Math.floor(s / 60);
    s = s % 60;
    // var h = Math.floor(m / 60); m = m % 60;
    // var d = Math.floor(h / 24); h = h % 24;
    //alert(d + ':' + h + ':' + m + ':' + s);
    //let finalhours = (h < 10 ? '0' : '') + h
    let finalMinutes = (m < 10 ? '0' : '') + m;
    let finalSeconds = (s < 10 ? '0' : '') + s;

    return finalMinutes + ':' + finalSeconds;
  }

  const clickedAction = (item, actionType, index) => {
    /// Making the Immutable data to mutable data
    let modifiedResponse = Immutable.asMutable(props.actualData, {
      deep: true
    });
    let today = new Date();
    let hours = (today.getHours() < 10 ? '0' : '') + today.getHours();
    let minutes = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
    let time = hours + ':' + minutes;

    if (modifiedResponse && modifiedResponse.length > 0) {
      modifiedResponse.filter(value => {
        let selectedNumber = item && item.id;
        let actualNumber = value && value.id;
        /// checking the number of tasks to be finish here...default task finished value is 0...
        let actualTaskNumber =
          value && value.numberOfTasksFinished
            ? value.numberOfTasksFinished
            : null;
        /// checking the totalnumber of tasks in each object
        let actualTotalTasks =
          value && value.totalNumberOfTasks ? value.totalNumberOfTasks : 0;
        if (actualNumber === selectedNumber) {
          let startTime = moment().format('MM/DD/YYYY hh:mm:ss');
          let endTime = moment().format('MM/DD/YYYY hh:mm:ss');

          if ((value && value.startLabel) === actionType) {
            ///changing the label status based on click like start/next(moving to status from notstarted to inprogress)
            value.notStarted = false;
            value.inProgress = true;
            value.isCompleted = false;
            if (
              value &&
              value.order_details &&
              value.order_details.length > 0
            ) {
              /// changing the status of first array of object like oil or filter etc
              value.order_details[0]['inProgress'] = true;
              value.order_details[0]['startTime'] = startTime;
              (value.numberOfTasksFinished = 1),
                ////////// MAKING ORDER UDPATE CALL HERE
                props.oderUpdateCall(value);
              ////////
            }
          } else if ((value && value.nextLabel) === actionType) {
            /// Checking total number of tasks is matched with total number of tasks done
            if (actualTotalTasks === actualTaskNumber) {
              if (
                value &&
                value.order_details &&
                value.order_details.length > 0
              ) {
                value.order_details.filter((list, i) => {
                  if (i === actualTaskNumber - 1) {
                    //////// calculating start and end time difference here and storing the difference value in end time attribute
                    let completedTime = timeDifference(
                      list && list.startTime,
                      endTime
                    );

                    //////// adding the multliple times here and assigning it to finishedTime attribute
                    let oldFinishedTime =
                      value &&
                      value.finishedTime &&
                      value.finishedTime === '00:00'
                        ? completedTime
                        : addTimes(value.finishedTime, completedTime);

                    list.inProgress = false;
                    list.isCompleted = true;
                    list.endTime = completedTime;
                    value.finishedTime = oldFinishedTime;
                    ////////// MAKING ORDER UDPATE CALL HERE
                    props.oderUpdateCall(value);
                  }
                });
              }
              /// if total tasks done is matching with total number of tasks then we are changing the status as vehicle completed
              value.notStarted = false;
              value.inProgress = false;
              value.isCompleted = true;

              //// MAKING COMPLETED ORDER CALL
              props.completedOrder(value);
            } else {
              value.notStarted = false;
              value.inProgress = true;
              value.isCompleted = false;
              if (
                value &&
                value.order_details &&
                value.order_details.length > 0
              ) {
                value.order_details.filter((list, i) => {
                  if (i === actualTaskNumber - 1) {
                    //////// calculating start and end time difference here and storing the difference value in end time attribute
                    let completedTime = timeDifference(
                      list && list.startTime,
                      endTime
                    );
                    //////// adding the multliple times here
                    let oldFinishedTime =
                      value &&
                      value.finishedTime &&
                      value.finishedTime === '00:00'
                        ? completedTime
                        : addTimes(value.finishedTime, completedTime);

                    /// changing the status of next array of object like oil or filter etc to completed and increasing the tasknumber with + 1
                    list.inProgress = false;
                    list.isCompleted = true;
                    list.endTime = completedTime;
                    value.numberOfTasksFinished = actualTaskNumber + 1;
                    value.finishedTime = oldFinishedTime;
                    ////////// MAKING ORDER UDPATE CALL HERE
                    props.oderUpdateCall(value);
                  } else if (i === actualTaskNumber) {
                    /// changing the status of next array of object like oil or filter etc to inprogress
                    list.inProgress = true;
                    list.isCompleted = false;
                    list.startTime = startTime;

                    ////////// MAKING ORDER UDPATE CALL HERE
                    props.oderUpdateCall(value);
                  }
                });
              }
            }
          }
        }
      });
    }
    props.modifiyResponse(modifiedResponse, index);
  };

  let vehicleDetails =
    props.item &&
    props.item.vehicles &&
    props.item.vehicles.length > 0 &&
    props.item.vehicles[0]
      ? props.item.vehicles[0]
      : null;

  return (
    <View style={styles.itemListMainView} key={props.index}>
      <TouchableOpacity
        style={
          props.orientation ? styles.itemListView : styles.itemListViewLandscape
        }
        onPress={() => {
          props.setModalVisible(true);
          props.clickedOderDetail(props.item);
        }}
      >
        <View style={{ flex: 0.4, alignItems: 'center' }}>
          <Text style={styles.itemListTitleText}>
            {props.item && props.item.id ? props.item.id : ''}
          </Text>
        </View>
        <View style={{ flex: props.orientation ? 0.9 : 1 }}>
          <Text style={styles.itemListTitleText}>
            {(props.item && props.item.first_name
              ? props.item.first_name
              : '') +
              ' ' +
              (props.item && props.item.last_name ? props.item.last_name : '')}
          </Text>
        </View>
        <View style={{ flex: 0.4 }}>
          <Text style={styles.itemListTitleText}>
            {vehicleDetails && vehicleDetails.year ? vehicleDetails.year : ''}
          </Text>
        </View>
        <View style={{ flex: props.orientation ? 0.5 : 0.7 }}>
          <Text style={styles.itemListTitleText}>
            {vehicleDetails && vehicleDetails.make ? vehicleDetails.make : ''}
          </Text>
        </View>
        <View style={{ flex: props.orientation ? 0.8 : 1 }}>
          <Text style={styles.itemListTitleText}>
            {vehicleDetails && vehicleDetails.model ? vehicleDetails.model : ''}
          </Text>
        </View>
        <View style={{ flex: 1, marginRight: 5, marginLeft: 5 }}>
          <Text style={styles.itemListTitleText}>
            {props.item && props.item.updated
              ? moment(props.item.updated).format('dddd, MMMM Do YYYY, h:mm a')
              : ''}
          </Text>
        </View>
        <View
          style={{
            flex: props.orientation
              ? props.item && props.item.inProgress
                ? 0.6
                : 0
              : 0.4
          }}
        >
          {props.item && props.item.inProgress ? (
            <View style={styles.flexWithItemsCenter}>
              <TouchableOpacity
                style={
                  props.orientation
                    ? styles.itemListResetButtonView
                    : styles.itemListResetButtonViewLandScape
                }
                onPress={() => {
                  clickedReset(
                    props.item,
                    props.item.notStarted
                      ? props.item && props.item.startLabel
                      : props.item.inProgress
                      ? props.item && props.item.nextLabel
                      : props.item && props.item.completedLabel,
                    props.index
                  );
                }}
              >
                <Text style={styles.resetText}>RESET</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        <View style={{ flex: 2.2, flexDirection: 'row' }}>
          {props.item &&
            (props.item.notStarted ||
              props.item.inProgress ||
              props.item.isCompleted) && (
              <View style={{ flex: 2.2, flexDirection: 'row' }}>
                <View style={styles.flexWithItemsCenter}>
                  <TouchableOpacity
                    disabled={
                      props.item.isCompleted ||
                      props.item.status === 'ORDER_COMPLETED'
                        ? true
                        : false
                    }
                    style={
                      props.item.isCompleted ||
                      props.item.status === 'ORDER_COMPLETED'
                        ? styles.itemListActionButtonFinishedView
                        : [
                            styles.itemListActionButtonView,
                            {
                              backgroundColor: props.item.inProgress
                                ? 'red'
                                : 'black'
                            }
                          ]
                    }
                    onPress={() => {
                      clickedAction(
                        props.item,
                        props.item.notStarted
                          ? props.item && props.item.startLabel
                          : props.item.inProgress
                          ? props.item && props.item.nextLabel
                          : props.item && props.item.completedLabel,
                        props.index
                      );
                    }}
                  >
                    {props.item.isCompleted ||
                    props.item.status === 'ORDER_COMPLETED' ? (
                      <Icon
                        size={20}
                        name="check"
                        color="#888888"
                        containerStyle={{ justifyContent: 'center' }}
                      />
                    ) : null}
                    <Text
                      style={[
                        styles.actionText,
                        {
                          color:
                            props.item.isCompleted ||
                            props.item.status === 'ORDER_COMPLETED'
                              ? '#888888'
                              : 'white'
                        }
                      ]}
                    >
                      {props.item.status === 'ORDER_COMPLETED'
                        ? props.item && props.item.completedLabel
                        : props.item.notStarted
                        ? props.item && props.item.startLabel
                        : props.item.inProgress
                        ? props.item && props.item.nextLabel
                        : props.item && props.item.completedLabel}
                    </Text>
                  </TouchableOpacity>
                </View>
                {props.item &&
                  props.item.order_details &&
                  props.item.order_details.length > 0 && (
                    <View style={{ flex: 1 }}>
                      {props.item.order_details.map((val, i) => {
                        return (
                          <View style={{ flex: 1 }} key={i}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                              <View
                                style={{
                                  flex: val && val.isCompleted ? 0.2 : 0.15,
                                  justifyContent: 'center'
                                }}
                              >
                                {val && val.isCompleted ? (
                                  <Icon
                                    size={15}
                                    name="check"
                                    color="red"
                                    containerStyle={{
                                      justifyContent: 'center'
                                    }}
                                  />
                                ) : (
                                  <View
                                    style={{
                                      height: 10,
                                      width: 10,
                                      borderRadius: 10 / 2,
                                      backgroundColor:
                                        val && val.inProgress ? 'red' : 'black'
                                    }}
                                  />
                                )}
                              </View>
                              <View style={styles.typeView}>
                                <Text
                                  style={[
                                    styles.taskSubTtitle,
                                    {
                                      color:
                                        val && val.inProgress ? 'red' : 'black'
                                    }
                                  ]}
                                >
                                  {val && val.category_text
                                    ? val.category_text
                                    : ''}
                                </Text>
                              </View>
                              <View style={styles.timeView}>
                                <Text style={styles.subTtitle}>
                                  {val && val.endTime ? val.endTime : ''}
                                </Text>
                              </View>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}
                <View style={styles.finishedTimeView}>
                  <Text style={styles.subTtitle}>
                    {props.item && props.item.finishedTime
                      ? props.item.finishedTime
                      : ''}
                  </Text>
                </View>
              </View>
            )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default RenderItem;
