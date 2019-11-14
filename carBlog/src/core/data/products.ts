import { Article, Profile, Product, Shop } from "../model";
import { RemoteImage } from "@src/assets/images";

const profile1 : Profile = { nickname: "小李飞刀",carNumber:'粤A·56GQT9',location:'350米',avatar:new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567666184592&di=121d2dc4e8e6ef5c21d8065b25f327c1&imgtype=0&src=http%3A%2F%2Fimg.xinxic.com%2Fimg%2F9ef89c23839b7664.jpg") }
const profile2 : Profile = { nickname: "极速漂移",carNumber:'粤B·I578CV',location:'120米',avatar:new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567666184589&di=821d15540a52302a74174968d522a5f2&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201511%2F06%2F20151106233720_ALJMe.jpeg") }

export const shops : Shop[] = [
  {
    id : "1",
    owner : profile1,
    logo : new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567679067217&di=251f9b691b7ccd3c584b1fb47b30fe8a&imgtype=0&src=http%3A%2F%2Fimg006.hc360.cn%2Fg3%2FM06%2F3C%2FB9%2FwKhQvVHXac2EMK_HAAAAANmJgkU990.jpg"),
    slogan : "儿童益智玩具，便宜，实用",
    visitCounts : 139
    // distance : "300m"
  },
  {
    id : "2",
    owner : profile2,
    logo : new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567679067217&di=8aa36a58bd1957b0a4b046c396ef51e4&imgtype=0&src=http%3A%2F%2Fimg007.hc360.cn%2Fk3%2FM0E%2F4E%2FCB%2FwKhQx1eDEzOENwduAAAAAKXAXGw135.jpg"),
    slogan : "自家特产土鸡蛋，新鲜出炉",
    visitCounts : 400
    // distance : "1.2公里"
  }
]

export const products : Product[] = [
  {
    id : "1",
    shop : shops[0],
    productName : "卡通棋",
    logo : new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567679067217&di=251f9b691b7ccd3c584b1fb47b30fe8a&imgtype=0&src=http%3A%2F%2Fimg006.hc360.cn%2Fg3%2FM06%2F3C%2FB9%2FwKhQvVHXac2EMK_HAAAAANmJgkU990.jpg"),
    productSlogan : "好玩有趣",
    productDescription : "质量过瘾",
    price : 30.00,
    visitCounts : 391,
    images : [
      new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567754703643&di=e728cc0c2a37be1bee0b77fb993f960f&imgtype=0&src=http%3A%2F%2Fpic.qjimage.com%2Fph050%2Fhigh%2Fph3287-p00777.jpg"),
      new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567754703640&di=8df0fab1f14ead38536885116a5407b4&imgtype=0&src=http%3A%2F%2Fimage5.huangye88.com%2F2013%2F05%2F08%2Fbba6ce1f1d1d5937.jpg"),
      new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567754774988&di=d075bf5478c94c5a524ffcc5147b6839&imgtype=jpg&src=http%3A%2F%2Fbaidu.cdn.dong-shou.com%2Fuploads%2Fimages%2Fc%2F30%2F26344.jpg"),
      new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567754703675&di=0d5c3b6748709752f4c340735b2a0dc9&imgtype=0&src=http%3A%2F%2Fwww.kzyey.net%2Fadmin%2Fwebedit%2FUploadFile%2F201075174358184.jpg"),
    ]
  },
  {
    id : "2",
    shop : shops[1],
    productName : "土鸡蛋",
    logo : new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567679067217&di=8aa36a58bd1957b0a4b046c396ef51e4&imgtype=0&src=http%3A%2F%2Fimg007.hc360.cn%2Fk3%2FM0E%2F4E%2FCB%2FwKhQx1eDEzOENwduAAAAAKXAXGw135.jpg"),
    productSlogan : "好吃，原生态",
    productDescription : `安全卫生
    安全卫生
    安全卫生
    安全卫生
    安全卫生
    安全卫生`,
    price : 12.5,
    visitCounts : 226,
    images : [
      new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567754551475&di=5a5260f1863288bcc9e8fa5b97df7085&imgtype=0&src=http%3A%2F%2Fimg003.hc360.cn%2Fm8%2FM0B%2FC8%2F5C%2FwKhQplZK2fKEcRhvAAAAALgK-bg246.jpg"),
      new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567754551473&di=7937f21a87b99e8c17670d7ef5f97858&imgtype=0&src=http%3A%2F%2Fimg001.hc360.cn%2Fk3%2FM09%2FD1%2F76%2FwKhQv1rit66EM4SuAAAAAISqd2I415.jpg"),
      new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567754551471&di=2b60b987b6eb4476763fd4e61c6b9666&imgtype=0&src=http%3A%2F%2Fimg011.hc360.cn%2Fg6%2FM03%2F6C%2F21%2FwKhQsVOlARiEd8dIAAAAAKPYl9s184.jpg"),
      new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567755127435&di=de80190f7435eb7a14460f9ecfc702cd&imgtype=0&src=http%3A%2F%2Fimage.biaobaiju.com%2Fuploads%2F20180803%2F21%2F1533304112-WLwAxKbUQs.jpg")
    ]
  }
]



export const shopList : Shop[] = [1,2,3,4,5,6,7,8].map(i=>shops[i%2])
export const productList : Product[] = [1,2,3,4,5,6,7,8,9].map(i=>products[i%2])
