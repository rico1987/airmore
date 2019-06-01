import { Component, OnInit, Input } from '@angular/core';

const links = {
  google : {
    url: 'https://plus.google.com/share?url={url}&t={title}',
    width: 500,
    height: 490,
  },

  facebook : {
    url: 'http://www.facebook.com/sharer/sharer.php?u={url}&title={title}',
    width: 673,
    height: 374,
  },

  twitter : {
    url: 'https://twitter.com/intent/tweet?url={url}&text={title}',
    width: 548,
    height: 430,
  },

  weixin: {
    img : 'https://airmore.cn/do.php?action=qrcode&data={url}&size=5',
  },

  douban: {
    url : 'http://www.douban.com/share/service?href={url}&name={title}&text={text}',
  },

  weibo: {
    url : 'http://service.weibo.com/share/share.php?url={url}&title={title}&searchPic=true',
  },
};

@Component({
  selector: 'app-sharer',
  templateUrl: './sharer.component.html',
  styleUrls: ['./sharer.component.scss']
})
export class SharerComponent implements OnInit {

  @Input() shareUrl: string;

  @Input() shareTitle: string;

  @Input() shareText: string;

  @Input() lang: string = 'zh';

  @Input() weixinImgSize: number = 25;

  private weixinQrcodeUrl: string;

  constructor() {}

  ngOnInit() {
    this.weixinQrcodeUrl = this.getShareLink('weixin');
  }

  getShareTip(name: string): string {
    return  `Share to ${name}`;
  }

  getShareLink(name: string): string {

    let link = links[name].url || links[name].img;

    link = link.replace(/\{(\w+)\}/g, function (m0, m1) {
      if (m1 === 'url') {
        return encodeURIComponent(this.shareUrl);
      } else if (m1 === 'title') {
        return encodeURIComponent(this.shareTitle);
      } else if (m1 === 'text') {
        return encodeURIComponent(this.shareText);
      }
    }.bind(this));
    return link;
  }


  shareTo(name: string): void {
    if(name !== 'weixin') {
      let link = this.getShareLink(name);
      window.open(link, `share-to-${name}`);
    }
  }
}
