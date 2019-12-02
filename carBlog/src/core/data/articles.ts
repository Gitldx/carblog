import { Article, Profile } from "../model";
import { RemoteImage } from "@src/assets/images";

export const author1 : Profile = { nickname: "小李飞刀+王五大刀",carNumber:'粤A·56GQT9',location:'350米',image:new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567666184592&di=121d2dc4e8e6ef5c21d8065b25f327c1&imgtype=0&src=http%3A%2F%2Fimg.xinxic.com%2Fimg%2F9ef89c23839b7664.jpg") }
export const author2 : Profile = { nickname: "极速漂移",carNumber:'粤B·I578CV',location:'120米',image:new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567666184589&di=821d15540a52302a74174968d522a5f2&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201511%2F06%2F20151106233720_ALJMe.jpeg") }

export const articles : Article[] = [
    {
        id:"1",
        author :author1,
        title: '今天天气真好！',
        content: `风和日丽，秋高气爽，山清水秀，心情舒畅
    
        秋登兰山寄张五
        
    北山白云里，隐者自怡悦。
    相望试登高，心飞逐鸟灭。
    愁因薄暮起，兴是清秋发。
    时见归村人，沙行渡头歇。
    天边树若荠，江畔洲如月。
    何当载酒来，共醉重阳节。
        `,
        comments: [
          { author: author1, text: "文章写的不错", likesCount: 3, date: "2天前", comments: [] },
          { author: author2, text: "文章写的不错", likesCount: 3, date: "2天前", comments: [] },
          { author: author1, text: "文章写的不错", likesCount: 3, date: "2天前", comments: [] },
          { author: author2, text: "文章写的不错", likesCount: 3, date: "2天前", comments: [] },
          { author: author1, text: "文章写的不错", likesCount: 3, date: "2天前", comments: [] }
        ],
        image: new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567446943433&di=26741cd7c2d234a484213844918f727e&imgtype=0&src=http%3A%2F%2Fimg5.xiazaizhijia.com%2Fwalls%2F20140618%2Fmid_5da9e14022bebcd.jpg"),
        likes: 34,
        visitCounts: 13,
        date: '4天前'
      },



      {
        id : "2",
        author : author2,
        title: '今天天气真好！开车跑了一千公里，发现新世界',
        content: `风和日丽，秋高气爽，山清水秀，心情舒畅
    
        秋登兰山寄张五
        
    北山白云里，隐者自怡悦。
    相望试登高，心飞逐鸟灭。
    愁因薄暮起，兴是清秋发。
    时见归村人，沙行渡头歇。
    天边树若荠，江畔洲如月。
    何当载酒来，共醉重阳节。
        `,
        comments: [
          { author: author1, text: "文章写的不错", likesCount: 3, date: "2天前", comments: [] },
          { author: author2, text: "文章写的不错", likesCount: 3, date: "2天前", comments: [] },
          { author: author1, text: "文章写的不错", likesCount: 3, date: "2天前", comments: [] },
          { author: author2, text: "文章写的不错", likesCount: 3, date: "2天前", comments: [] },
          { author: author1, text: "文章写的不错", likesCount: 3, date: "2天前", comments: [] }
    
        ],
        image: new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567446943433&di=26741cd7c2d234a484213844918f727e&imgtype=0&src=http%3A%2F%2Fimg5.xiazaizhijia.com%2Fwalls%2F20140618%2Fmid_5da9e14022bebcd.jpg"),
        likes: 34,
        visitCounts: 13,
        date: '4天前'
      }
]


export const blogList : Article[]= [1,2,3,4,5,6,7,8,/* 9,10,11,12,13,14,15 */].map(i=>articles[i%2])
