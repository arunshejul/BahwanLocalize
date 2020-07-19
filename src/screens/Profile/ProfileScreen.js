import React, {Component} from 'react';
import {Linking, Text, View, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import styles from './styles';
import CodePush from 'react-native-code-push';

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restartAllowed: false,
    };
  }

  handleCanOpenURL = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(`tel:${url}`);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  componentDidMount() {
    //this.getProfileDetails();
  }

  codePushStatusDidChange(syncStatus) {
    switch (syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        this.setState({syncMessage: 'Checking for update.'});
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        this.setState({syncMessage: 'Downloading package.'});
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        this.setState({syncMessage: 'Awaiting user action.'});
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        this.setState({syncMessage: 'Installing update.'});
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        this.setState({syncMessage: 'App up to date.', progress: false});
        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        this.setState({
          syncMessage: 'Update cancelled by user.',
          progress: false,
        });
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        this.setState({
          syncMessage: 'Update installed and will be applied on restart.',
          progress: false,
        });
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        this.setState({
          syncMessage: 'An unknown error occurred.',
          progress: false,
        });
        break;
    }
  }

  codePushDownloadDidProgress(progress) {
    this.setState({progress});
  }

  toggleAllowRestart() {
    this.state.restartAllowed
      ? CodePush.disallowRestart()
      : CodePush.allowRestart();

    this.setState({restartAllowed: !this.state.restartAllowed});
  }

  getUpdateMetadata() {
    CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING).then(
      (metadata: LocalPackage) => {
        this.setState({
          syncMessage: metadata
            ? JSON.stringify(metadata)
            : 'Running binary version',
          progress: false,
        });
      },
      (error: any) => {
        this.setState({syncMessage: 'Error: ' + error, progress: false});
      },
    );
  }

  /** Update is downloaded silently, and applied on restart (recommended) */
  sync() {
    CodePush.sync(
      {},
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this),
    );
  }

  /** Update pops a confirmation dialog, and then immediately reboots the app */
  syncImmediate() {
    CodePush.sync(
      {installMode: CodePush.InstallMode.IMMEDIATE, updateDialog: true},
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this),
    );
  }

  render() {
    let progressView;

    if (this.state.progress) {
      progressView = (
        <Text style={styles.messages}>
          {this.state.progress.receivedBytes} of{' '}
          {this.state.progress.totalBytes} bytes received
        </Text>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.sectionHeader}>Welcome to CodePush!</Text>
        <TouchableOpacity onPress={() => this.handleCanOpenURL('08275514481')}>
          <Text style={styles.sectionHeader}>Call Us</Text>
          <View style={styles.itemView}>
            <Text style={styles.item}>(827)551-4481</Text>
            <Image
              source={require('../../../assets/phone.png')}
              style={styles.forwardArrowImage}
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.sectionHeader}>Reach Us At</Text>
        <View style={styles.itemView}>
          <Text style={styles.item}>
            04/B, Sushant Society, Pashan,Pune, Maharashtra-411021.
          </Text>
        </View>
        <Text style={styles.sectionHeader}></Text>
        <View style={styles.itemView}>
          <TouchableOpacity onPress={this.sync.bind(this)}>
            <Text style={styles.syncButton}>Press for background sync</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.itemView}>
          <TouchableOpacity onPress={this.syncImmediate.bind(this)}>
            <Text style={styles.syncButton}>Press for dialog-driven sync</Text>
          </TouchableOpacity>
        </View>

        {progressView}

        <View style={styles.itemView}>
          <TouchableOpacity onPress={this.toggleAllowRestart.bind(this)}>
            <Text style={styles.restartToggleButton}>
              Restart {this.state.restartAllowed ? 'allowed' : 'forbidden'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.itemView}>
          <TouchableOpacity onPress={this.getUpdateMetadata.bind(this)}>
            <Text style={styles.syncButton}>Press for Update Metadata</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionHeader}></Text>
        <View style={styles.itemView}>
          <Text style={styles.messages}>{this.state.syncMessage || ''}</Text>
        </View>
      </View>
    );
  }
}
