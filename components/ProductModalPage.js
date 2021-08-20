import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Image
} from 'react-native';
import { Icon } from 'react-native-elements';
import menuLogo from '../../public/menuLogo.svg';

const moment = require('moment');
const Divider = <View style={{ marginVertical: 20 }} />;

const ProductModalPage = props => {
  // const [isShowRepeatModal, onOpenRepeatOrderModal] = React.useState(false);
  // let formatPhoneNumber = (str) => {
  //     //Filter only numbers from the input
  //     let cleaned = ('' + str).replace(/\D/g, '');
  //     //Check if the input is of correct length
  //     let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  //     if (match) {
  //         return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  //     }
  //     return null;
  // };

  let vehicleDetails =
    props &&
    props.data &&
    props.data.vehicles &&
    props.data.vehicles.length > 0 &&
    props.data.vehicles[0]
      ? props.data.vehicles[0]
      : null;

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.modalView}>
          <View style={styles.modalSubView}>
            <View style={styles.orderDetailsView}>
              <View style={{ flex: 0.9 }}>
                <Text style={styles.orderDetailsText}>ORDER DETAILS</Text>
              </View>
              <TouchableOpacity
                style={styles.closeIconView}
                onPress={() => {
                  props.closeModal(false);
                }}
              >
                <Icon name="close" size={60} color={'black'} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 4.5 }}>
              <ScrollView>
                {Divider}
                <View
                  style={{
                    flex: 1,
                    marginTop: 30
                  }}
                >
                  <View style={styles.ServiceDetailsView}>
                    <View style={{ flex: Platform.OS === 'web' ? 0.28 : 0.25 }}>
                      <Text style={styles.descriptionText} />
                    </View>
                    <View
                      style={{
                        flex: Platform.OS === 'web' ? 0.15 : 0.13,
                        flexWrap: 'wrap'
                      }}
                    >
                      <Text style={styles.descriptionText}>Product</Text>
                    </View>
                    {/*<View style={{ flex: Platform.OS === 'web' ? 0.15 : 0.15 }}>*/}
                    {/*    <Text style={styles.descriptionText}>Price</Text>*/}
                    {/*</View>*/}
                    {/*<View style={{ flex: Platform.OS === 'web' ? 0.15 : 0.17, alignItems: 'center' }}>*/}
                    {/*    <Text style={styles.descriptionText}>Subtotal</Text>*/}
                    {/*</View>*/}
                  </View>
                  <View style={{ flex: 1 }}>
                    {props &&
                    props.data &&
                    props.data.order_details &&
                    props.data.order_details.length > 0
                      ? props.data.order_details.map((val, index) => {
                          return (
                            <View
                              style={{
                                flex: 1,
                                flexDirection: 'row',
                                marginTop: 15
                              }}
                              key={index}
                            >
                              <View style={{ flex: 0.2 }}>
                                {/*<Text style={styles.serviceTypeText}>{val && val.description ? val.description : ''}</Text>*/}
                                <Image
                                  source={menuLogo}
                                  style={{ width: 40, height: 40 }}
                                />
                              </View>
                              <View
                                style={{
                                  flex: 1,
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  flexWrap: 'wrap'
                                }}
                              >
                                <Text
                                  style={{
                                    ...styles.serviceTypeText,
                                    fontSize: 18
                                  }}
                                >
                                  {val && val.description
                                    ? val.description
                                    : ''}
                                </Text>
                                {/*<Text style={styles.serviceTypeText}>{val && val.qty ? val.qty : ''}</Text>*/}
                                <Text
                                  style={{
                                    ...styles.serviceTypeText,
                                    marginTop: 0,
                                    fontSize: 14
                                  }}
                                >
                                  {val && val.regular_price
                                    ? '$' + val.regular_price
                                    : ''}
                                </Text>
                              </View>
                              {/*<View style={{ flex: 0.15, alignItems: 'flex-end' }}>*/}
                              {/*    <Text style={styles.serviceTypeText}>{val && val.total ? '$' + val.total : ''}</Text>*/}
                              {/*</View>*/}
                            </View>
                          );
                        })
                      : null}
                  </View>
                </View>
                {Divider}
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  descriptionTextOne: {
    fontSize: Platform.OS === 'web' ? 14 : 18,
    color: 'black',
    fontWeight: '500',
    marginTop: 10
  },
  orderPlacedText: {
    fontSize: Platform.OS === 'web' ? 13 : 17,
    color: 'black',
    fontWeight: '500',
    padding: 10
  },
  mainContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    width: '75%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  justFlex: {
    flex: 1
  },
  modalView: {
    width: '95%',
    height: '95%',
    backgroundColor: 'white',
    borderRadius: 10
  },
  modalSubView: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20
  },
  orderDetailsView: {
    flex: 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'grey',
    borderBottomWidth: 1
  },
  orderDetailsText: {
    fontSize: Platform.OS === 'web' ? 26 : 30,
    color: 'black',
    fontWeight: 'bold'
  },
  closeIconView: {
    flex: 0.1,
    alignItems: 'center'
  },
  orderDetailsViewOne: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  descriptionTitleTextOne: {
    fontSize: Platform.OS === 'web' ? 20 : 24,
    color: 'red',
    fontWeight: '500'
  },
  customerDetailsView: {
    flex: 1.8,
    flexDirection: 'row'
    //alignItems: 'center'
  },
  ServiceDetailsView: {
    flex: 0.25,
    flexDirection: 'row',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 15,
    paddingBottom: 15
  },
  subTotalView: {
    flex: 0.8,
    flexDirection: 'row'
  },
  serviceTypeText: {
    fontSize: Platform.OS === 'web' ? 14 : 18,
    color: 'black',
    fontWeight: '500',
    marginTop: Platform.OS === 'web' ? 20 : 30
  },
  totalAmountText: {
    fontSize: Platform.OS === 'web' ? 15 : 20,
    color: 'black',
    fontWeight: '500',
    marginTop: 15
  },
  totalAmountTextOne: {
    fontSize: Platform.OS === 'web' ? 15 : 20,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 15
  },
  descriptionText: {
    fontSize: Platform.OS === 'web' ? 15 : 20,
    color: 'black',
    fontWeight: '500'
  },
  descriptionTitleText: {
    fontSize: Platform.OS === 'web' ? 20 : 24,
    color: 'red',
    fontWeight: '500',
    marginTop: 10
  }
});

export default ProductModalPage;
