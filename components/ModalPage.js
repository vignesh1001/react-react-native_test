import React from 'react';
import {
  Button,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform
} from 'react-native';
import { Icon } from 'react-native-elements';
const moment = require('moment');
const Divider = <View style={{ marginVertical: 20 }} />;

const ModalPage = props => {
  const [isShowRepeatModal, onOpenRepeatOrderModal] = React.useState(false);
  let formatPhoneNumber = str => {
    //Filter only numbers from the input
    let cleaned = ('' + str).replace(/\D/g, '');

    //Check if the input is of correct length
    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
  };

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
              <View style={{ flex: 0.5, flexDirection: 'row' }}>
                <View style={{ flex: 0.4, justifyContent: 'center' }}>
                  <Text style={styles.descriptionText}>Order Status:</Text>
                </View>
                {props && props.data && props.data.status ? (
                  <View
                    style={{
                      flex: 0.5,
                      backgroundColor: 'grey',
                      borderRadius: 20,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Text style={styles.orderPlacedText}>
                      {props.data.status}
                    </Text>
                  </View>
                ) : null}
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
                <View style={styles.orderDetailsViewOne}>
                  <View style={{ flex: 0.5 }}>
                    {props && props.data && props.data.id ? (
                      <Text style={styles.descriptionTitleTextOne}>
                        Order Number
                      </Text>
                    ) : null}
                    {props.data.id}
                    {props && props.data && props.data.updated ? (
                      <Text style={styles.descriptionTextOne}>
                        {moment(props.data.updated).format(
                          'dddd, MMMM Do YYYY, h:mm a'
                        )}
                      </Text>
                    ) : null}
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <Text style={styles.descriptionTitleTextOne}>
                      Customer Details
                    </Text>
                    <Text style={styles.descriptionTitleText}>
                      {props &&
                        props.data &&
                        (props.data.first_name ? props.data.first_name : '') +
                          ' ' +
                          (props.data.last_name ? props.data.last_name : '')}
                    </Text>
                    {/* <Text style={styles.descriptionTextOne}>123 Main St</Text>
                                        <Text style={styles.descriptionTextOne}>Highlands Ranch, CO 80129</Text> */}
                    {props && props.data && props.data.email ? (
                      <Text style={styles.descriptionTextOne}>
                        {props.data.email}
                      </Text>
                    ) : null}
                    {props && props.data && props.data.customer_phone ? (
                      <Text style={styles.descriptionTextOne}>
                        {formatPhoneNumber(props.data.customer_phone)}
                      </Text>
                    ) : null}
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <Text style={styles.descriptionTitleTextOne}>
                      Vehicle Details
                    </Text>
                    <Text style={styles.descriptionTitleText}>
                      {vehicleDetails &&
                        (vehicleDetails.year ? vehicleDetails.year : '') +
                          ' ' +
                          (vehicleDetails.make ? vehicleDetails.make : '')}
                    </Text>
                    {vehicleDetails && vehicleDetails.description ? (
                      <Text style={styles.descriptionTextOne}>
                        {vehicleDetails.description}
                      </Text>
                    ) : null}
                    {vehicleDetails && vehicleDetails.engine ? (
                      <Text style={styles.descriptionTextOne}>
                        {vehicleDetails.engine}
                      </Text>
                    ) : null}
                    {vehicleDetails && vehicleDetails.vin ? (
                      <Text style={styles.descriptionTextOne}>
                        VIN: {vehicleDetails.vin}
                      </Text>
                    ) : null}
                    {vehicleDetails && vehicleDetails.license_number ? (
                      <Text style={styles.descriptionTextOne}>
                        License Plate: {vehicleDetails.license_number}
                      </Text>
                    ) : null}
                    {/* <Text style={styles.descriptionTextOne}>Last Oil Used: Castrol Edge</Text>
                                        <Text style={styles.descriptionTextOne}>Last Filter: N/A</Text> */}
                  </View>
                </View>
                {Divider}
                <View>
                  <Button
                    onPress={() => props.showRepeatOrderModal()}
                    title="+ Add item"
                    color="red"
                    accessibilityLabel="Repeat the same order"
                  />
                </View>
                {Divider}
                <View
                  style={{
                    flex: 1,
                    marginTop: 30
                  }}
                >
                  <View style={styles.ServiceDetailsView}>
                    <View style={{ flex: Platform.OS === 'web' ? 0.58 : 0.55 }}>
                      <Text style={styles.descriptionText}>Service</Text>
                    </View>
                    <View style={{ flex: Platform.OS === 'web' ? 0.15 : 0.13 }}>
                      <Text style={styles.descriptionText}>Qty</Text>
                    </View>
                    <View style={{ flex: Platform.OS === 'web' ? 0.15 : 0.15 }}>
                      <Text style={styles.descriptionText}>Price</Text>
                    </View>
                    <View
                      style={{
                        flex: Platform.OS === 'web' ? 0.15 : 0.17,
                        alignItems: 'center'
                      }}
                    >
                      <Text style={styles.descriptionText}>Subtotal</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    {props &&
                    props.data &&
                    props.data.order_details &&
                    props.data.order_details.length > 0
                      ? props.data.order_details.map((val, index) => {
                          return (
                            <View
                              style={{ flex: 1, flexDirection: 'row' }}
                              key={index}
                            >
                              <View style={{ flex: 0.5 }}>
                                <Text style={styles.serviceTypeText}>
                                  {val && val.description
                                    ? val.description
                                    : ''}
                                </Text>
                              </View>

                              <View
                                style={{ flex: 0.15, alignItems: 'center' }}
                              >
                                <Text style={styles.serviceTypeText}>
                                  {val && val.qty ? val.qty : ''}
                                </Text>
                              </View>

                              <View
                                style={{ flex: 0.15, alignItems: 'center' }}
                              >
                                <Text style={styles.serviceTypeText}>
                                  {val && val.regular_price
                                    ? '$' + val.regular_price
                                    : ''}
                                </Text>
                              </View>

                              <View
                                style={{ flex: 0.15, alignItems: 'flex-end' }}
                              >
                                <Text style={styles.serviceTypeText}>
                                  {val && val.total ? '$' + val.total : ''}
                                </Text>
                              </View>
                            </View>
                          );
                        })
                      : null}
                  </View>
                </View>
                {Divider}
                <View style={styles.subTotalView}>
                  <View
                    style={{
                      flex: props.orientation
                        ? 0.7
                        : Platform.OS === 'web'
                        ? 0.82
                        : 0.75
                    }}
                  />
                  <View
                    style={{
                      flex: props.orientation
                        ? 0.3
                        : Platform.OS === 'web'
                        ? 0.18
                        : 0.25,
                      flexDirection: 'row'
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.totalAmountText}>Subtotal</Text>
                      <Text style={styles.totalAmountText}>Tax</Text>
                      <Text style={styles.totalAmountText}>Total</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.totalAmountText}>
                        {props.data && props.data.sub_total
                          ? '$' + props.data.sub_total
                          : ''}
                      </Text>
                      <Text style={styles.totalAmountText}>
                        {props.data && props.data.tax
                          ? '$' + props.data.tax
                          : ''}
                      </Text>
                      <Text style={styles.totalAmountTextOne}>
                        {props.data && props.data.total
                          ? '$' + props.data.total
                          : ''}
                      </Text>
                    </View>
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
    height: '100%',
    width: '100%'
  },
  container: {
    flex: 1,
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
    flexDirection: 'row'
  },
  descriptionTitleTextOne: {
    fontSize: Platform.OS === 'web' ? 20 : 24,
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

export default ModalPage;
