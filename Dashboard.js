import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
  Keyboard,
  Image,
  TextInput
} from 'react-native';
import { connect } from 'react-redux';
import DashboardActions from '../../Redux/DashboardRedux';
import styles from './DashboardStyles';
import Immutable from 'seamless-immutable';
import { Icon } from 'react-native-elements';
import Orientation from '../../Components/Orientation';
import menuLogo from '../../../public/menuLogo.svg';
import RenderItem from './Components/RenderItem';
import LoginActions from '../../Redux/LoginRedux';
import ModalPage from '../../Components/ModalPage';
import ProductModalPage from '../../Components/ProductModalPage';
import PickerView from '../../Components/PickerView';
//const RCTNetworking = require('react-native/Libraries/Network/RCTNetworking')

const moment = require('moment');

const Divider = <View style={{ marginVertical: 20 }} />;

const DashboardPage = props => {
  const textInputReference = useRef(null);

  const [response, modifiyResponse] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isProductModalVisible, setProductModalVisible] = useState(false);
  const [selectedData, clickedOderDetail] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [orientation, setOrientation] = useState(
    Orientation.isPortrait() ? true : false
  );

  useEffect(() => {
    let requestData = {
      token: props && props.loginData && props.loginData.token,
      store_id:
        props.loginData && props.loginData.store_id
          ? props.loginData.store_id
          : null
    };
    props.actionDashboardDataRequest(requestData);
  }, []);

  useEffect(() => {
    Dimensions.addEventListener('change', () => {
      setOrientation(Orientation.isPortrait() ? true : false);
    });
    return () => {
      Dimensions.removeEventListener('change', () => {
        setOrientation(Orientation.isPortrait() ? true : false);
      });
    };
  }, []);

  useEffect(() => {
    if (
      props.dashboardData &&
      props.dashboardData.content &&
      props.dashboardData.content.length > 0
    ) {
      let mutableData = Immutable.asMutable(props.dashboardData.content, {
        deep: true
      });

      modifiyResponse(mutableData);
    }
  }, [props.dashboardData]);

  useEffect(() => {
    let actualOrdersData = response && response.length > 0 ? response : [];
    const intervalId = setInterval(function() {
      props.asyncDashboardDataRequest({
        token: props && props.loginData && props.loginData.token,
        store_id:
          props.loginData && props.loginData.store_id
            ? props.loginData.store_id
            : null,
        actualOrdersData: actualOrdersData
      });
    }, 10000);

    return () => clearInterval(intervalId);
  });

  let totalSeconds = 0;
  const countTimer = () => {
    ++totalSeconds;
    var hour = Math.floor(totalSeconds / 3600);
    var minute = Math.floor((totalSeconds - hour * 3600) / 60);
    var seconds = totalSeconds - (hour * 3600 + minute * 60);
    if (hour < 10) hour = '0' + hour;
    if (minute < 10) minute = '0' + minute;
    if (seconds < 10) seconds = '0' + seconds;
    return minute + ':' + seconds;
  };

  const renderListTitle = (number, titleText) => {
    return (
      <View
        style={{
          flex: number,
          marginLeft: 2
        }}
      >
        {titleText ? <Text style={styles.title}>{titleText}</Text> : null}
      </View>
    );
  };

  const startTIMER = (numberOfTasksDone, totalNumberOfTasks, value) => {
    setInterval(() => {}, 1000);

    return () => clearInterval();
  };

  const completedOrder = data => {
    let completedOrderRequest = {
      store_id:
        props.loginData && props.loginData.store_id
          ? props.loginData.store_id
          : null,
      token:
        props.loginData && props.loginData.token ? props.loginData.token : null,
      order_id: data && data.id ? data.id : null,
      status: 'ORDER_COMPLETED'
    };
    props.orderCompleteRequest(completedOrderRequest);
  };
  const oderUpdateCall = data => {
    let oderDetailsArr = [];
    if (data && data.order_details && data.order_details.length > 0) {
      data.order_details.map((item, i) => {
        oderDetailsArr.push({
          id: item && item.id ? item.id : null,
          sku: item && item.sku ? item.sku : null,
          regular_price: item && item.regular_price ? item.regular_price : null,
          title: item && item.title ? item.title : null,
          description: item && item.description ? item.description : null,
          category: item && item.category ? item.category : null,
          sub_category: item && item.sub_category ? item.sub_category : null,
          image: item && item.image ? item.image : null,
          meta_value: item && item.meta_value ? item.meta_value : null,
          age_restrict: item && item.age_restrict ? item.age_restrict : null,
          variation: item && item.variation ? item.variation : null,
          listed_price: item && item.listed_price ? item.listed_price : null,
          qty: item && item.qty ? item.qty : null,
          threshold_qty: item && item.threshold_qty ? item.threshold_qty : null,
          up_sells: item && item.up_sells ? item.up_sells : null,
          cross_sells: item && item.cross_sells ? item.cross_sells : null,
          rank: item && item.rank ? item.rank : null,
          total: item && item.total ? item.total : null,
          tax: item && item.tax ? item.tax : null,
          item_status: {
            progress: item && item.inProgress ? item.inProgress : null,
            completed: item && item.isCompleted ? item.isCompleted : null,
            startTime: item && item.startTime ? item.startTime : null,
            endTime: item && item.endTime ? item.endTime : null
          }
        });
      });
    }

    let updateOderRequest = {
      store_id:
        props.loginData && props.loginData.store_id
          ? props.loginData.store_id
          : null,
      token:
        props.loginData && props.loginData.token ? props.loginData.token : null,
      order_id: data && data.id ? data.id : null,
      status: data && data.status ? data.status : null,
      order_details:
        oderDetailsArr && oderDetailsArr.length > 0 ? oderDetailsArr : []
    };
    props.orderUpdateRequest(updateOderRequest);
  };

  const changedResponse = (res, index) => {
    modifiyResponse(res);
  };

  const changeModalVisible = value => {
    setModalVisible(value);
  };

  const clickedOderDetailPage = data => {
    clickedOderDetail(data);
  };

  const handleChange = event => {
    console.log(event);
    setSearchText(event.target.value);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View
          style={
            orientation
              ? styles.subContainerView
              : styles.subContainerViewLandScape
          }
        >
          {/* Begin of Header Section */}
          <View style={styles.headerSectionView}>
            <View style={{ flex: 0.15 }}>
              <Image
                source={menuLogo}
                alt="Take 5 logo"
                style={{ width: 40, height: 40, margin: '10px 0 0 40px' }}
              />
            </View>
            <View style={{ flex: 0.7 }}>
              <Text style={styles.headerTitle}>ASSOCIATE DASHBOARD</Text>
            </View>
            <View style={{ flex: 0.5, borderBottom: '3px yellow solid' }}>
              <Text style={styles.headerTitle}>All Orders</Text>
            </View>
            <View style={styles.filterView}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-end'
                }}
                onPress={() => {
                  // RCTNetworking.clearCookies(() => { })
                  props.logoutRequest();
                  props.navigation.navigate('Login');
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '500',
                    color: 'white'
                  }}
                >
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 0.5,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}
            >
              <Text style={styles.userNameText}>
                Store {props.loginData && props.loginData.store_id}
              </Text>
              <View style={styles.initialsView}>
                <Text style={styles.initialsText}>S</Text>
              </View>
            </View>
          </View>
          {/* End of Header Section */}
          <View style={styles.itemListMainContainer}>
            <View
              style={
                orientation
                  ? styles.itemListContainer
                  : styles.itemListContainerLandScape
              }
            >
              <View style={styles.oderView}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%'
                  }}
                >
                  <Text style={styles.orderTitleText}>ORDERS</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%'
                    }}
                  >
                    <TextInput
                      style={{
                        marginLeft: 20,
                        height: 45,
                        fontSize: 18,
                        width: '50%',
                        backgroundColor: '#EEE',
                        paddingRight: 12,
                        paddingLeft: 12
                      }}
                      onChange={handleChange}
                      testID={'search_input'}
                      value={searchText}
                      placeholder={
                        'Search by year, modal, make, or licence plate'
                      }
                    />
                  </View>
                </View>
              </View>
              <View style={{ flex: 8, marginTop: 30 }}>
                <View style={styles.itemListHeaderView}>
                  {/* {renderListTitle(0.5, '#')} */}
                  <View
                    style={{
                      flex: 0.4,
                      alignItems: 'center'
                    }}
                  >
                    <Text style={styles.title}>#</Text>
                  </View>
                  {renderListTitle(1, 'Name')}
                  {renderListTitle(0.4, 'Year')}
                  {renderListTitle(0.7, 'Make')}
                  {renderListTitle(1, 'Model')}
                  {renderListTitle(1, 'Order Date')}
                  {renderListTitle(0.6, null)}
                  {renderListTitle(2.2, 'Status')}
                </View>
                <View style={{ flex: 8, marginTop: 10 }}>
                  <ScrollView>
                    {response &&
                      response.length > 0 &&
                      response.map((item, i) => {
                        return (
                          <RenderItem
                            key={i}
                            item={item}
                            index={i}
                            actualData={response}
                            modifiyResponse={changedResponse}
                            oderUpdateCall={oderUpdateCall}
                            completedOrder={completedOrder}
                            setModalVisible={changeModalVisible}
                            clickedOderDetail={clickedOderDetailPage}
                            orientation={orientation}
                          />
                        );
                      })}
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>
        </View>
        {modalVisible ? (
          <ModalPage
            orientation={orientation}
            closeModal={() => {
              setModalVisible(!modalVisible);
            }}
            data={selectedData}
            showRepeatOrderModal={() =>
              setProductModalVisible(!isProductModalVisible)
            }
          />
        ) : null}
        {isProductModalVisible ? (
          <ProductModalPage
            orientation={orientation}
            closeModal={() => {
              setProductModalVisible(!isProductModalVisible);
            }}
            data={selectedData}
          />
        ) : null}
      </View>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    loginData: state.loginPage.successData,
    dashboardData: state.dashboardPage.successData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actionDashboardDataRequest: requestData =>
      dispatch(DashboardActions.dashboardDataRequest(requestData)),
    asyncDashboardDataRequest: requestData =>
      dispatch(DashboardActions.asyncDashboardDataRequest(requestData)),
    logoutRequest: () => dispatch(LoginActions.logoutRequest()),
    orderUpdateRequest: data =>
      dispatch(DashboardActions.orderUpdateRequest(data)),
    orderCompleteRequest: data =>
      dispatch(DashboardActions.orderCompleteRequest(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPage);
