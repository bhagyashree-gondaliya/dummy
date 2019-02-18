import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  Share,
  Keyboard,
  CameraRoll
} from "react-native";
import ImageZoom from "react-native-image-pan-zoom";

const url = "https://api.unsplash.com/search/photos";
const key = "6d205a538421268388309d54bdfac001a276ad4275686c7ae3b4c4fe2a74f9de";
const options = ["car", "happy", "book", "random", "girl", "art", "animation"];
export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      images: [],
      modalVisible: false,
      imageIndex: "",
      iamgeUrl: "",
      inputValue: "Search Something",
      query: "random"
    };
    this.getImagesFromApiAsync = this.getImagesFromApiAsync.bind(this);
    this.searchClicked = this.searchClicked.bind(this);
  }

  imageClicked(imageIndex) {
    this.state.images.forEach((item, index) => {
      if (imageIndex == index) {
        var main_url = item.urls.regular;
        this.setState({ iamgeUrl: main_url, modalVisible: true });
      }
    });
  }
  closeClicked() {
    this.setState({ modalVisible: false, imageIndex: "", iamgeUrl: "" });
  }
  searchClicked() {
    if (!options.includes(this.state.inputValue)) {
      options.unshift(this.state.inputValue);
    }
    if (this.state.inputValue !== "") {
      Keyboard.dismiss;
      this.getImagesFromApiAsync(this.state.inputValue);
    }
  }
  getImagesFromApiAsync(value) {
    return fetch(url + `?per_page=30&query=${value}&client_id=` + key)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ images: responseJson.results });
      })
      .catch(error => {
        console.error(error);
      });
  }
  inputValueChange(text) {
    this.setState({ inputValue: text });
  }
  optionClicked(value) {
    this.setState({ inputValue: value });
    this.getImagesFromApiAsync(value);
  }
  shareClicked(value) {
    var shareValue = {
      title: "Image",
      message: "Hello i am sharing image",
      subject: "ImageShared",
      url: value
    };
    Share.share(shareValue);
  }

  saveClicked(value) {
    CameraRoll.saveToCameraRoll(value, "photo");
    alert("Open Your Gallery and Enjoy :)");
  }
  componentWillMount() {}
  componentDidMount() {
    this.getImagesFromApiAsync(this.state.query);
  }
  componentWillUnmount() {}
  options() {
    return options.map(value => {
      return (
        <TouchableOpacity key={value} onPress={() => this.optionClicked(value)}>
          <View style={styles.options}>
            <Text>{value}</Text>
          </View>
        </TouchableOpacity>
      );
    });
  }
  images() {
    return this.state.images.map((image, index) => {
      return (
        <View>
          <TouchableOpacity
            key={image.title}
            onPress={() => this.imageClicked(index)}
          >
            <Image
              key={image.id}
              style={styles.itemPink}
              source={{ uri: image.urls.small }}
            />
          </TouchableOpacity>
        </View>
      );
    });
  }
  render() {
    return (
      <View>
        <Text style={styles.title}> Find Your Favourite Image</Text>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            type="text"
            style={styles.input}
            value={this.state.inputValue}
            onChangeText={text => this.inputValueChange(text)}
            onFocus={() => {
              this.setState({ inputValue: "" });
            }}
          />
          <TouchableHighlight
            style={styles.search}
            onPress={this.searchClicked}
          >
            <Text style={{ textAlign: "center" }}>Search</Text>
          </TouchableHighlight>
        </View>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          {this.options()}
        </ScrollView>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.items}>{this.images()}</View>
          </View>
          <Modal visible={this.state.modalVisible}>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <TouchableHighlight
                style={styles.close}
                onPress={this.closeClicked.bind(this)}
              >
                <Text style={{ textAlign: "center" }}>Close</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.close}
                onPress={() => this.shareClicked(this.state.iamgeUrl)}
              >
                <Text style={{ textAlign: "center" }}>Share</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.close}
                onPress={() => this.saveClicked(this.state.iamgeUrl)}
              >
                <Text style={{ textAlign: "center" }}>Save</Text>
              </TouchableHighlight>
            </View>
            <ImageZoom
              cropWidth={Dimensions.get("window").width}
              cropHeight={Dimensions.get("window").height}
              imageWidth={300}
              imageHeight={500}
            >
              <Image
                style={styles.mainImage}
                source={{ uri: this.state.iamgeUrl }}
                scale
              />
            </ImageZoom>
          </Modal>
          {this.state.modalVisible ? <View style={styles.modal} /> : null}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    backgroundColor: "white",
    marginBottom: 180
  },
  title: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 20,
    color: "grey",
    fontStyle: "normal",
    fontWeight: "bold"
  },
  input: {
    height: 40,
    width: "60%",
    borderColor: "grey",
    borderWidth: 1,
    marginLeft: 10,
    marginTop: 25,
    color: "grey",
    padding: 10,
    borderRadius: 10
  },
  items: {
    backgroundColor: "white"
  },
  modal: {
    backgroundColor: "grey",
    margin: 30,
    height: "80%",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 30
  },
  close: {
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    marginTop: 20,
    marginLeft: 10,
    backgroundColor: "grey",
    width: "30%",
    padding: 15,
    borderRadius: 10
  },
  search: {
    marginTop: 20,
    marginLeft: 10,
    backgroundColor: "grey",
    width: "30%",
    padding: 15,
    borderRadius: 10
  },
  itemPink: {
    padding: 100,
    borderRadius: 20,
    margin: 10
  },
  mainImage: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    marginTop: -50
  },
  options: {
    backgroundColor: "#D3D3D3",
    width: 80,
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    margin: 5
  }
});
