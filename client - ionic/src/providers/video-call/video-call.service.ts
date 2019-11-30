import { Injectable } from "@angular/core";
import { Socket } from "ng-socket-io";
import { MessageProvider } from "../message/message";
import { BehaviorSubject } from "rxjs";
import { UserProvider } from "../user/user";

declare var apiRTC: any
@Injectable()
export class VideoCallService {
    myCallId: BehaviorSubject<any> = new BehaviorSubject<any> (undefined)
    webRTCClient;
    showCall: boolean;
    showHangup: boolean;
    showAnswer: boolean;
    showReject: boolean;
    showStatus: boolean;
    showRemoteVideo: boolean = true;
    showMyVideo: boolean = true;
    status;
    incomingCallId = 0;
    openVideoModal: BehaviorSubject<any>= new BehaviorSubject<any>(false)
    closeVideoModal: BehaviorSubject<any>= new BehaviorSubject<any>(false)
    isUserOnline: boolean = false
    constructor( 
          public socket: Socket,
          public toast: MessageProvider, 
          public user: UserProvider,
         ) {
      this.InitializeApiRTC();
    }
    InitializeApiRTC() {
      //apiRTC initialization
      apiRTC.init({
        apiKey: "bfa378271772131c314150afda4067b6",
        //apiCCId : "1",
        onReady: (e) => {
          this.sessionReadyHandler(e);
        } 
      });
    }
    sessionReadyHandler(e) {
      this.myCallId.next(apiRTC.session.apiCCId);
      // this.toast.successToast(`My id: ${apiRTC.session.apiCCId}`)
      this.InitializeControls();
      this.AddEventListeners();
      this.InitializeWebRTCClient();
    }
     
    InitializeControls() {
      this.showCall = true;
      this.showAnswer = false;
      this.showHangup = false;
      this.showReject = false;
    }
    AddEventListeners() {
      apiRTC.addEventListener("userMediaSuccess", (e) => {
        this.status = "You are calling " + e.detail.remoteId + "<br/>";
        this.status = this.status + "CallID = " + e.detail.callId + "<br/>";
        this.status = this.status + "Call Type = " + e.detail.callType;
        this.showStatus = true;
        this.showMyVideo = true;
        
       
        this.webRTCClient.addStreamInDiv(e.detail.stream, e.detail.callType, "mini", 'miniElt-' + e.detail.callId, {
          width: "96px",
          height: "128px"
        }, true);
  
  /*      this.AddStreamInDiv(e.detail.stream, e.detail.callType, "mini", 'miniElt-' + e.detail.callId, {
          width: "128px",
          height: "96px"
        }, true);*/
  
      });
  
      apiRTC.addEventListener("userMediaError", (e) => {
        this.InitializeControlsForHangup();
        this.toast.errorToast('Thiết bị người dùng bị lỗi')
      });
  
      apiRTC.addEventListener("incomingCall", (e) => {
        this.InitializeControlsForIncomingCall();
        this.incomingCallId = e.detail.callId;
        this.openVideoCall()
      });
  
      apiRTC.addEventListener("hangup", (e) => {
     
        if (e.detail.lastEstablishedCall === true) {
          this.InitializeControlsForHangup();
        }
        this.status = this.status + "<br/> The call has been hunged up due to the following reasons <br/> " + e.detail.reason;
        this.RemoveMediaElements(e.detail.callId);
      });
  
      apiRTC.addEventListener("remoteStreamAdded", (e) => {
        this.webRTCClient.addStreamInDiv(e.detail.stream, e.detail.callType, "remote", 'remoteElt-' + e.detail.callId, {
          
        height: "100vh"
        }, false);
      });
      
      //UpdateMediaDeviceOnCall
      apiRTC.addEventListener("userMediaStop", (e)=>{
        this.webRTCClient.removeElementFromDiv('mini', 'miniElt-' + e.detail.callId);
      });
      apiRTC.addEventListener("remoteStreamRemoved", (e)=>{
        this.webRTCClient.removeElementFromDiv('remote', 'remoteElt-' + e.detail.callId);
      });
    }
    InitializeWebRTCClient() {
      this.webRTCClient = apiRTC.session.createWebRTCClient({
        status: "status" //Optionnal
      });
      apiRTC.addEventListener("webRTCClientCreated",(e)=> this.webRTCClientCreatedHandler(e));
      // this.webRTCClient.setAllowMultipleCalls(true);
      // this.webRTCClient.setVideoBandwidth(300);
      // this.webRTCClient.setUserAcceptOnIncomingCall(true);
      // this.webRTCClient.setUserAcceptOnIncomingCallBeforeGetUserMedia(true);
    }
    webRTCClientCreatedHandler(e) {
      this.webRTCClient.setAllowMultipleCalls(true);
      this.webRTCClient.setVideoBandwidth(300);
      this.webRTCClient.setUserAcceptOnIncomingCall(true);
   }
    InitializeControlsForHangup() {
      this.showCall = true;
      this.showAnswer = false;
      this.showReject = false;
      this.showHangup = false;
    }
    InitializeControlsForIncomingCall() {
      this.showCall = false;
      this.showAnswer = true;
      this.showReject = true;
      this.showHangup = true;
    }
    RemoveMediaElements(callId) {
      this.closeVideoModal.next(true)
      // this.webRTCClient.removeElementFromDiv('mini', 'miniElt-' + callId);
      // this.webRTCClient.removeElementFromDiv('remote', 'remoteElt-' + callId);
    }
    UpdateControlsOnAnswer() {
      this.showAnswer = false;
      this.showReject = false;
      this.showHangup = true;
      this.showCall = false;
    }
    AddStreamInDiv(stream, callType, divId, mediaEltId, style, muted) {
      let mediaElt = null;
      let divElement = null;
  
      if (callType === 'audio') {
        mediaElt = document.createElement("audio");
      } else {
        mediaElt = document.createElement("video");
      }
  
      mediaElt.id = mediaEltId;
      mediaElt.autoplay = true;
      mediaElt.muted = muted;
      mediaElt.style.width = style.width;
      mediaElt.style.height = style.height;
  
      divElement = document.getElementById(divId);
      divElement.appendChild(mediaElt);
  
      this.webRTCClient.attachMediaStream(mediaElt, stream);
    }
    UpdateControlsOnReject() {
      this.showAnswer = false;
      this.showReject = false;
      this.showHangup = false;
      this.showCall = true;
    }
    MakeCall(calleeId) {
      // calleeId = '945679'
      this.isUserOnline = false
      if(calleeId){
        this.openVideoCall()
        var callId = this.webRTCClient.call(calleeId);
        if (callId != null) {
          this.incomingCallId = callId;
          this.showHangup = true;
        }
        
      }else{
        this.toast.errorToast('Tạm thời không thể gọi! Người dùng không online')
      }
    }
  
    HangUp() {
      this.webRTCClient.hangUp(this.incomingCallId);
    }
  
    AnswerCall(incomingCallId) {
      this.webRTCClient.acceptCall(incomingCallId);
      this.UpdateControlsOnAnswer();
    }
  
    RejectCall(incomingCallId) {
      this.webRTCClient.refuseCall(incomingCallId);
      this.UpdateControlsOnReject();
      this.RemoveMediaElements(incomingCallId);
    }
    openVideoCall(){
      console.log( 'openVideoCall was called')
      this.openVideoModal.next(true)
    }
    updateCallId(){
      try{
        this.user.updateInfoNoToast({
          callId: apiRTC.session.apiCCId
        })
      }catch(err){
        console.log( err)
      }
    }
}