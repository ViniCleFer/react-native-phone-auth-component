import React from "react";
import {
  View,
  Dimensions,
  Text,
  Animated,
  TextInput,
  Platform,
  TouchableOpacity
} from "react-native";
import Button from "./Button";
import CountryPicker from "react-native-country-picker-modal-vcf";
import PropTypes from "prop-types";

const { width } = Dimensions.get("window");

class PhoneVerifyScreen extends React.Component {
  constructor(p) {
    super(p);
    this.state = {
      number: "",
      code: "",
      keyboardHeight: 0,
      countryInfo: {
        cca2: p.cca2,
        callingCode: p.callingCode
      },

      verifying: true,
      verifyOpacity: new Animated.Value(0),
      redeemOpacity: new Animated.Value(0),

      appState: "",

      loading: false,
      loadingRedeem: false
    };
    this.styles = {
      title: {
        fontStyle: "normal",
        color: "#625C70",
        fontWeight: "bold",
        fontSize: 22,
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: -180,
        // marginBottom: -50,
        width: width,
        zIndex: 999
      },
      phoneAuthText: {
        fontSize: 20,
        alignItems: "center",
        margin: 1.5,
        fontFamily:
          Platform.OS === "android"
            ? this.props.androidFont
            : this.props.iOSFont
      },
      finePrint: {
        fontSize: 16,
        color: "gray",
        marginHorizontal: 15,
        marginTop: 10
      }
    };
  }

  _handleAppStateChange(nextAppState) {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      if (this._ref) {
        this._ref.focus();
      }
      if (this._ref2) {
        this._ref2.focus();
      }
    }
    this.setState({ appState: nextAppState });
  }

  componentDidMount() {
    setTimeout(() => {
      this._ref.focus();
    }, 1200);
    Animated.timing(this.state.verifyOpacity, { toValue: 1 }).start();
  }

  renderAreaCode() {
    let arr = [];
    let numbers = this.state.number.split("").slice(0, 2);
    for (let i = 0; i < 2; i++) {
      if (isNaN(numbers[i])) numbers[i] = "_";
    }
    // we can use indexOf here because it returns the first index that it encounters '_'
    let next = numbers.indexOf("_");

    arr.push(
      React.createElement(
        Text,
        { key: Math.random(), style: this.styles.phoneAuthText },
        "("
      )
    );
    numbers.map((num, index) => {
      let color = "black";
      if (index === next) color = this.props.color;
      arr.push(
        React.createElement(
          Text,
          { key: index, style: [this.styles.phoneAuthText, { color }] },
          num
        )
      );
    });
    arr.push(
      React.createElement(
        Text,
        { key: Math.random(), style: this.styles.phoneAuthText },
        ")"
      )
    );
    return arr;
  }

  renderNumber() {
    let arr = [];
    let numbers = this.state.number.split("").slice(0, 11);
    for (let i = 0; i < 11; i++) {
      if (isNaN(numbers[i])) numbers[i] = "_";
    }
    let next = numbers.indexOf("_");
    numbers.slice(2, 7).map((num, index) => {
      let color = "black";
      if (index + 2 === next) color = this.props.color;
      arr.push(
        React.createElement(
          Text,
          { key: index + 100, style: [this.styles.phoneAuthText, { color }] },
          num
        )
      );
    });
    arr.push(
      React.createElement(
        Text,
        { key: Math.random(), style: this.styles.phoneAuthText },
        "-"
      )
    );
    numbers.slice(7, 12).map((num, index) => {
      let color = "black";
      if (index + 7 === next) color = this.props.color;
      arr.push(
        React.createElement(
          Text,
          { key: index, style: [this.styles.phoneAuthText, { color }] },
          num
        )
      );
    });
    return arr;
  }

  renderCode() {
    let arr = [];
    let numbers = this.state.code.split("");
    for (let i = 0; i < this.props.codeLength; i++) {
      if (isNaN(numbers[i])) numbers[i] = "_";
    }
    let next = numbers.indexOf("_");
    numbers.map((num, index) => {
      let color = "black";
      if (index === next) color = this.props.color;
      arr.push(
        React.createElement(
          Text,
          {
            key: index,
            style: [this.styles.phoneAuthText, { color }]
          },
          num
        )
      );
    });
    return arr;
  }

  verify() {
    this.setState({ loading: true });
    let string = `+${this.state.countryInfo.callingCode}${this.state.number}`;
    this.props
      .signInWithPhone(string)
      .then(() => {
        Animated.timing(this.state.verifyOpacity, { toValue: 0 }).start(() => {
          this.setState({ verifying: false }, () => {
            Animated.timing(this.state.redeemOpacity, { toValue: 1 }).start();
          });
        });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  redeemCode() {
    this.setState({ loadingRedeem: true });
    this.props.redeemCode(String(this.state.code)).catch(() => {
      this.setState({ loadingRedeem: false });
    });
  }

  render() {
    let verifying = (
      <Animated.View
        style={{
          heigth: 400,
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: this.state.verifyOpacity,
          width: "100%"
          // backgroundColor: '#ff0'
        }}
      >
        <>
          <Text style={this.styles.title}>
            Digite o número do celular para receber o seu código
          </Text>
          <TouchableOpacity onPress={() => this._ref.focus()}>
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                marginLeft: -10,
                height: 80,
                marginBottom: 50,
                marginTop: 40
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginBottom: 15
                }}
              >
                <CountryPicker
                  onPress={() => {}}
                  cca2={this.state.countryInfo.cca2}
                  onChange={e => {
                    this._ref.focus();
                    this.setState({ countryInfo: e });
                  }}
                  onClose={() => this._ref.focus()}
                  filterable
                  closeable
                  showCallingCode
                />
                <Text style={[this.styles.phoneAuthText, { marginLeft: 10 }]}>
                  +{this.state.countryInfo.callingCode}
                </Text>
                {this.renderAreaCode()}
              </View>
              <View
                style={{
                  fontWeight: "normal",
                  fontSize: 5,
                  flexDirection: "row",
                  marginBottom: 15
                }}
              >
                {this.renderNumber()}
              </View>
            </View>
          </TouchableOpacity>
          <TextInput
            testID="phoneInput"
            ref={ref => (this._ref = ref)}
            keyboardType={"phone-pad"}
            style={{
              position: "absolute",
              top: -1000,
              left: -1000,
              backgroundColor: "tranparent",
              color: "transparent"
            }}
            value={this.state.number}
            onChangeText={num => {
              if (num.length < 12) {
                this.setState({ number: num });
              }
            }}
          />
          <View style={{ alignItems: "center" }}>
            <Button
              title={this.props.verifyButtonMessage}
              backgroundColor={this.props.color}
              onPress={() => this.verify()}
              loading={this.state.loading}
              spinnerColor={this.props.spinnerColor}
              textColor={this.props.buttonTextColor}
            />
          </View>
        </>
      </Animated.View>
    );

    let redeeming = (
      <Animated.View
        style={{
          opacity: this.state.redeemOpacity,
          marginBottom: this.state.keyboardHeight,
          justifyContent: "space-between",
          alignItems: "center",
          height: 100
          // backgroundColor: '#f0f'
        }}
      >
        <Text style={[this.styles.title, { height: 100, marginTop: -200 }]}>
          Digite o código de validação que você irá receber por sms em seu
          telefone
        </Text>

        <TouchableOpacity onPress={() => this._ref2.focus()}>
          <View
            style={{
              flexDirection: "row",
              fontSize: 5,
              marginTop: -50,
              paddingTop: 20
            }}
          >
            {this.renderCode()}
          </View>
        </TouchableOpacity>

        <TextInput
          testID="codeInput"
          autoFocus
          keyboardType={"phone-pad"}
          style={{ position: "absolute", top: -200, left: -200 }}
          value={this.state.code}
          onChangeText={num => {
            if (num.length < this.props.codeLength + 1) {
              this.setState({ code: num });
            }
          }}
          ref={ref => (this._ref2 = ref)}
        />
        <Button
          testID="codeButton"
          title={this.props.enterCodeMessage}
          backgroundColor={this.props.color}
          loading={this.state.loadingRedeem}
          onPress={() => this.redeemCode()}
          textColor={this.props.buttonTextColor}
          spinnerColor={this.props.spinnerColor}
        />
      </Animated.View>
    );

    return (
      <View style={this.props.containerStyle}>
        {this.state.verifying ? verifying : redeeming}
      </View>
    );
  }
}

// list of all RN fonts can be found at https://github.com/react-native-training/react-native-fonts
PhoneVerifyScreen.propTypes = {
  color: PropTypes.string,
  buttonTextColor: PropTypes.string,
  spinnerColor: PropTypes.string,
  redeemCode: PropTypes.func.isRequired,
  signInWithPhone: PropTypes.func.isRequired,
  androidFont: PropTypes.string,
  iOSFont: PropTypes.string,
  containerStyle: PropTypes.object,
  verifyButtonMessage: PropTypes.string,
  enterCodeMessage: PropTypes.string,
  disclaimerMessage: PropTypes.string,
  codeLength: PropTypes.number,

  cca2: PropTypes.string,
  callingCode: PropTypes.string
};

PhoneVerifyScreen.defaultProps = {
  color: "#6E8BC6",
  buttonTextColor: "white",
  spinnerColor: "white",
  redeemCode: () => console.log("Please attach method to redeemCode prop"),
  signInWithPhone: () =>
    console.log("Please attach method to signInWithPhone prop"),
  androidFont: "monospace",
  iOSFont: "Menlo",
  containerStyle: { flex: 1 },
  verifyButtonMessage: "Verify Phone Number*",
  enterCodeMessage: "Enter code",
  disclaimerMessage: "*Message & data rates may apply.",
  codeLength: 6,

  cca2: "BR",
  callingCode: "55"
};

export default PhoneVerifyScreen;
