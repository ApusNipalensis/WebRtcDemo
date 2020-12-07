import { Component } from '@angular/core';
import { MediaRecorder } from 'extendable-media-recorder';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  /** 開啟 鏡頭 */
  isStartBtn = true;
  /** 關閉 鏡頭 */
  isStopBtn = false;
  /** 開始 錄影 */
  isResetBtnStart = false;
  /** 停止 錄影 */
  isResetBtnStop = false;
  /** 錯誤訊息 */
  errMsg = '';
  /** 提取 視訊鏡頭的預設參數 */
  ogValue = {
    audio: true, // 聲音
    video: true  // 影像
  };

  mediaRecorder: any;

  /** 開啟 視訊鏡頭 */
  openWebCamera() {
    console.log('HELLO openWebCamera');
    this.isStartBtn = false;
    this.isStopBtn = true;
    this.isResetBtnStart = true;
    this.isResetBtnStop = false;

    // 使用 mediaDevices.getUserMedia 來獲取影像資料
    navigator.mediaDevices
    .getUserMedia(this.ogValue)
    .then( res => {
      if (res) {
        const myInVideo = document.querySelector('#inputVideo') as HTMLVideoElement;

        // 將獲取的影像 放到顯示區中
        myInVideo.srcObject = res;
        // 關閉影像控制鍵
        myInVideo.controls = false;
      }
    })
    .catch(err => {
      if (err) {
        console.log('is Err');
        // 顯示錯誤訊息
        this.errMsg = err.name;

        this.isStartBtn = true;
        this.isStopBtn = false;
        this.isResetBtnStart = false;
        this.isResetBtnStop = false;
      }
    });
  }

  /** 暫停 視訊鏡頭 */
  stopWebCamera() {
    this.isStartBtn = true;
    this.isStopBtn = false;
    this.isResetBtnStart = false;
    this.isResetBtnStop = false;

    console.log('is StopWebCamera');
    // 取得 輸入顯示的 元件內容
    const myInVideo = document.querySelector('#inputVideo') as HTMLVideoElement;
    const myVideo = myInVideo;
    // 將 myInVideo 轉型 MediaStream
    const myVideoToStream = myVideo.srcObject as MediaStream;
    // 關閉 webcam
    myVideoToStream.getTracks().forEach(res => res.stop());

    // 取得 輸出顯示的 元件內容
    const myOutVideo = document.querySelector('#outputVideo') as HTMLVideoElement;
    myOutVideo.src = '';
  }

  /** 開始 錄影 */
  starVideo() {
    this.isStartBtn = false;
    this.isStopBtn = false;
    this.isResetBtnStart = false;
    this.isResetBtnStop = true;

    // 取得 輸入顯示的 元件內容
    const myInVideo = document.querySelector('#inputVideo') as HTMLVideoElement;
    const myVideoToStream = myInVideo.srcObject as MediaStream;
    // 使用 MediaRecorder 取得 影音串流資料
    this.mediaRecorder = new MediaRecorder(myVideoToStream, {mimeType: 'video/webm;codecs=VP9'});
    // 開始 錄影
    this.mediaRecorder.start();
  }

  /** 停止 錄影 */
  stopVideo() {
    this.isStartBtn = false;
    this.isStopBtn = true;
    this.isResetBtnStart = true;
    this.isResetBtnStop = false;

    // 停止 錄影
    this.mediaRecorder.stop();

    // let _this = this;

    // 使用 JS 的監聽機制 取得 錄製期間的影音資料
    // tslint:disable-next-line: only-arrow-functions
    this.mediaRecorder.addEventListener('dataavailable', function(e: { data: Blob; }) {
      const chunks = [];

      chunks.push(e.data);
      // 取得 輸出顯示的 元件內容
      const myOutVideo = document.querySelector('#outputVideo') as HTMLVideoElement;
      const blob = new Blob(chunks, { type: 'video/webm' });
      // 將錄製的 影音資料 險是在另一個 <video> 上
      const vUrl = URL.createObjectURL(blob);
      myOutVideo.src = vUrl;
      // 顯示 控制項目
      myOutVideo.controls = true;
    });

  }

  /** 畫面截圖 */
  saveImg() {
    // 將畫面捲到最上方
    scrollTo(0, 0);

    // 使用 html2canvas 進行範圍截圖
    html2canvas(document.getElementById('container')).then( canvas => {
      if (canvas) {
        // 下載圖片
        const dl = document.createElement('a');
        dl.href = canvas.toDataURL('image/jpeg');
        dl.download = 'image.jpg';
        dl.click();
      }
    });
  }

}
