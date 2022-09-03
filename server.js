const http = require("http");
const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const server = http.createServer(app);
const path = require("path");
const fetch = require("node-fetch");

const cookieParser = require("cookie-parser");
const axios = require("axios");

app.use(cookieParser());
const port = 8080;

//Socket
const { Server } = require("socket.io");
const io = new Server(server);

let rooms = [];
let usernames = [];

let TQuestions = [
  "En son söylediğin yalan nedir?",
  "Bir buluşma sırasında yaptığın en utanç verici şey neydi?",
  "Arabanızla kaza yoluyla bir şeye (ya da birine!) çarptınız mı?",
  "Seviyormuş gibi davrandığınız ama aslında sevmediğiniz biri?",
  "En tuhaf takma adınız nedir?",
  "Fiziksel olarak en acı verici deneyiminiz nedir?",
  "Toplu taşımada yaptığınız en çılgın şey nedir?",
  "Bir cinle karşılaşsan üç dileğin ne olurdu?",
  "Başka birine söylediğin en kötü şey nedir?",
  "Şimdiye kadarki en kötü öpüşmen kimleydi?",
  "Ayna karşısında yaptığınız en çılgınca şey nedir?",
  "Başkası hakkında söylediğin en kötü şey nedir?",
  "Arkadaşlarınızla birlikte yapmayı sevdiğiniz fakat sevgilinizin önünde asla yapmayacağınız şey nedir?",
  "En çok kimi kıskanıyorsun?",
  "Favori pijamalarınız neye benziyor?",
  "Günde kaç tane selfie çekiyorsunuz?",
  "Aynı pantolonu haftada kaç kez giyiyorsunuz?",
  "Bugün lise aşkınla çıkar mısın?",
  "Nerenden gıdıklanıyorsun?",
  "Beğendiğinizi itiraf etmekten utandığınız film hangisi?",
  "En utanç verici bakım alışkanlığınız nedir?",
  "En son ne zaman özür diledin? Ne için?",
  "Hiç bir sevgilinizi aldatmayı düşündünüz mü?",
  "Hiç sevgilinizi aldattınız mı?",
  "Boxer mı yoksa külot mu?",
  "Hiç havuza işedin mi?",
  "Asla yakalanmayacağınızı garanti etseydiniz, Dünya’da kimi öldürürdünüz?",
  "Başkası için aldığınız en ucuz hediye nedir?",
  "En çok hangi uygulamada zaman harcıyorsunuz?",
  "Uçakta yaptığınız en tuhaf şey nedir?",
  "Hiç toplum içinde çıplak kaldınız mı?",
  "Hiç toplum içinde burnunuzu karıştırdınız mı?",
  "Yaşınız hakkında hiç yalan söylediniz mi?",
  "Duş almadan geçirdiğiniz en uzun süre nedir?",
  "Hiç sahte kimlik kullandınız mı?",
  "Bir ilişkide en büyük korkunuz nedir?",
  "Şu anda telefonunuzdaki en utanç verici mesaj nedir?",
  "Hiç ceset gördünüz mü?",
  "Sizce hangi ünlü abartılıyor?",
  "Dişlerinizi fırçalamadan geçirdiğiniz en uzun süre nedir?",
  "Hayattaki en büyük pişmanlığın nedir?",
  "Kimi çıplak görmekten nefret edersin?",
  "Sarhoşken yaptığınız en tuhaf şeyi anlatın.",
  "Sevgilinizden 1 milyon dolar için ayrılır mısınız?",
  "Hiç bir iş arkadaşınıza aşık oldunuz mu?",
  "Eski sevgililerinden herhangi birine karşı hala hislerin var mı?",
  "Bir restoranda bıraktığın en küçük bahşiş nedir?",
  "Sevdiğiniz ya da sevgiliniz olan kişinin dikkatini çekmek için yaptığınız en utanç verici şey?",
  "Asla yapamayacağınız bir şey nedir?",
  "Bir günlüğüne cinsiyet değiştirseniz ne yapardınız?",
  "Vücudunuzdaki en sevdiğiniz ve en sevmediğiniz yerler hangileri?",
  "En son ne zaman terk edildin?",
  "Hâlâ yaptığınız en çocukça şey nedir?",
  "En son ne zaman birini terk ettin?",
  "Bir yarışma programında partneriniz olarak bu odadan birini seçmeniz gerekse, bu kim olurdu ve neden?",
  "Kendinden kısa biriyle çıkar mısın?",
  "Hiç bir arkadaşın için yalan söyledin mi?",
  "Bu odadaki her insan hakkında değiştirmek istediğiniz bir şeyi söyleyin.",
  "En son ne zaman başka birini ağlattın?",
  "Kalabalık karşısında yaptığınız en utanç verici şey nedir?",
  "Bir günlüğüne görünmez olabilseydin, yapacağın en kötü şey ne olurdu?",
  "Hayatının en güzel günü neydi?",
  "Hiç osurduğunuz ve suçu başkasına attığınız oldu mu?",
  "Kaç kişiyi öptün?",
  "Hiç asansörde osurdunuz mu?",
  "Hiç yanlış kişiye nude gönderdiniz mi? Kime?",
  "Hiç tek gecelik ilişki yaşadınız mı?",
  "Bir haftalık ömrünüz kalmış olsaydı ve bu odadaki biriyle evlenmek zorunda olsaydınız, bu kim olurdu?",
  "Odadaki herkes hakkında bir olumlu ve bir olumsuz şey listeleyin.",
  "En son ne zaman pantolonuna işedin?",
  "Sinemada yaptığınız en çılgın şey nedir?",
  "En uzun ilişkiniz ne kadar sürdü?",
  "Sosyal medyada paylaştığın en utanç verici post nedir?",
  "Birine söylediğin en iyi yalan nedir?",
  "En utanç verici çocukluk anınız nedir?",
  "Aşık olmasaydınız zengin biriyle evlenir miydiniz?",
  "Gizlice zevk aldığınız en iğrenç koku nedir?",
  "Tek başına yaptığın en iğrenç şey nedir?",
  "Sahip olmayı dilediğin bir beceri nedir?",
  "Hiç toplum içinde kustun mu?",
  "Şimdiye kadar öpüştüğün en iyi kişi kim?",
  "Birinin size verdiği en kötü hediye nedir?",
  "Tuvalette otururken yaşadığınız en garip düşünce nedir?",
  "Hiç bir patrona veya öğretmene aşık oldunuz mu?",
  "En son ne zaman başka biriyle diş fırçasını paylaştınız?",
  "Duşta en çok hangi şarkıyı söylersin?",
  "Birlikte olmaktan en çok pişman olduğun kişi kim?",
  "Issız bir adaya düşsen yanında kimi isterdin?",
  "En eski iç çamaşırını ne kadar süredir kullanıyorsun?",
  "Yanan bir binadaki insanları kurtarıyor olsaydınız ve bu odadan bir kişiyi geride bırakmak zorunda kalsaydınız bu kim olurdu?",
];

let DQuestions = [
  "Yaşlı bir kadın ya da yaşlı bir adam gibi davran",
  "10 kere etrafında dön, bittiğinde düz bir çizgide yürümeye çalışın",
  "10 zıpla ve 10 şınav çek",
  "Alfabeyi 30 saniyede geriye doğru söyleyin",
  "1 dakika tavuk gibi davran",
  "Senin sıran gelene kadar gözlerini kapat",
  "En sevdiğin çizgi film karakteri gibi davran",
  "Söyleyeceğiniz her şeyden sonra 'muz' deyin.",
  "Senin sıran gelene kadar maymun gibi davran",
  "Bir kaşık dolusu fıstık ezmesi ye",
  "Ayakkabı iplerinizi birbirine bağlayın ve geriye doğru yürümeye çalışın",
  "Bir sonraki sıraya kadar bir bebek gibi davranın",
  "En sevdiğin süper kahraman gibi davran",
  "Senin sıran gelene kadar bir heykel gibi hareket et (konuşmadan veya hareket etmeden)",
  "Kedi gibi miyavla",
  "En sevdiğin şarkıyı söyle",
  "2 dakika uçak olduğunuzu farz et ve bir uçak gibi 2 dakika boyunca uç",
  "Balerin gibi dans et",
  "En iyi hip hop dansını yap",
];

io.on("connection", (socket) => {
  console.log("Kullanıcı Giriş yaptı");
  socket.on("disconnect", (data) => {
    console.log(`${data.username} Çıkış yaptı`);
  });
  socket.on("join", (room, username) => {
    rooms[socket.id] = room;
    usernames[socket.id] = username;

    socket.leaveAll();
    socket.join(room);
    console.log(rooms);
    console.log(`${username} kullanıcısı ${room} url'sine sahip odaya girdi`);
    socket.emit("join");
    io.in(rooms[socket.id]).emit("join room", username);
  });
  socket.on("send", (msg) => {
    io.in(rooms[socket.id]).emit("recieve", `${usernames[socket.id]} : ${msg}`);
  });
  socket.on("join room", (data) => {
    socket.emit("join room", data);
  });
  socket.on("recieve", function (message) {
    socket.emit("recieve", message);
  });
  socket.on("new Question Truth", (data) => {
    io.in(rooms[socket.id]).emit(
      "get Question Truth",
      `${usernames[socket.id]} <br> ${
        TQuestions[Math.floor(Math.random() * TQuestions.length)]
      }`
    );
  });
  socket.on("new Question Dare", (data, username) => {
    io.in(rooms[socket.id]).emit(
      "get Question Dare",
      `${usernames[socket.id]} <br> ${
        DQuestions[Math.floor(Math.random() * DQuestions.length)]
      }`
    );
  });
  socket.on("get Question Truth", (data) => {
    socket.emit("get Question Truth", data);
  });
  socket.on("get Question Dare", (data) => {
    socket.emit("get Question Dare", data);
  });
});

function generate_token(length) {
  var a =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_".split("");
  var b = [];
  for (var i = 0; i < length; i++) {
    var j = (Math.random() * (a.length - 1)).toFixed(0);
    b[i] = a[j];
  }
  return b.join("");
}
//Body Parser
app.use(bodyParser.json()).use(
  bodyParser.urlencoded({
    extended: true,
  })
);
//Static
app.use(express.static("public"));
app.set("src", "path/to/views");
//MongoDB
const dbURL = process.env.db;
mongoose
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    server.listen(port, () => {
      console.log("mongoDB Bağlantı kuruldu");
    });
  })
  .catch((err) => console.log(err));
//Collections
let Rooms = require("./models/room.js");
let Users = require("./models/users.js");

app.get("/", (req, res) => {
  let token = req.cookies.token;
  if (token != null) {
    Rooms.find({ private: "false" })
      .sort()
      .then((roomsResult) => {
        Rooms.find({ private: "false" })
          .count()
          .then((roomsCountResult) => {
            Rooms.find({ roomAdminToken: token }).then((yourRoomsResult) => {
              Rooms.find({ roomAdminToken: token })
                .count()
                .then((yourRoomsCount) => {
                  Users.findOne({ token: token }).then((userResult) => {
                    res.render(`${__dirname}/src/pages/room-list.ejs`, {
                      rooms: roomsResult,
                      user: userResult,
                      roomCount: roomsCountResult,
                      yourRooms: yourRoomsResult,
                      yourRoomCount: yourRoomsCount,
                    });
                  });
                });
            });
          });
      });
  } else {
    res.redirect("/login");
  }
});
//Room
app.get("/room/:url", (req, res) => {
  let token = req.cookies.token;
  let url = req.params.url;
  if (token != null) {
    Rooms.findOne({ url: url }).then((roomResult) => {
      Users.findOne({ token: token }).then((userResult) => {
        res.render(`${__dirname}/src/pages/room.ejs`, {
          room: roomResult,
          roomId: url,
          user: userResult,
        });
      });
    });
  } else {
    res.redirect("/");
  }
});
//Login Page
app.get("/login", (req, res) => {
  let token = req.cookies.token;
  if (token != null) {
    res.redirect("/");
  } else {
    res.render(`${__dirname}/src/pages/index.ejs`);
  }
});
//Forms
//Login
app.post("/login", (req, res) => {
  var userId = req.cookies.id;
  if (userId != null) {
    res.redirect("/");
  } else {
    var user = new Users({
      username: req.body.username,
      token: generate_token(11),
    });
    user.save().then((UserResult) => {
      res.cookie("token", UserResult.token);
      res.redirect("/");
    });
  }
});
//Create room
app.post("/create/room/:token", (req, res) => {
  let token = req.params.token;
  let roomID = generate_token(8);
  Users.findOne({ token: token }).then((userResult) => {
    if (userResult.room != "true") {
      let room = new Rooms({
        roomname: req.body.roomname,
        roomurl: roomID,
        roomAdminToken: token,
        private: req.body.private,
        bannedMembers: [],
      });
      room.save().then((roomResult) => {
        Users.findOneAndUpdate(
          { token: roomResult.roomAdminToken },
          {
            room: "true",
            thisRoomUrl: roomID,
          }
        ).then((result) => {
          res.redirect(`/room/${roomID}`);
        });
      });
    } else {
      res.send("ZATEN ODAN VAR");
    }
  });
});
//Delete Room
app.post("/delete/room/:id", (req, res) => {
  let url = req.params.id;
  let token = req.cookies.token;
  Rooms.findById(url).then((roomResult) => {
    if (roomResult.roomAdminToken == token) {
      Rooms.findByIdAndDelete(url).then((result) => {
        Users.findOneAndUpdate(
          { token: token },
          {
            room: "false",
          }
        ).then((result) => {
          res.redirect("/");
        });
      });
    } else {
      res.send("ODA SENİN DEĞİL");
    }
  });
});
