<head>
<title>DC - Rooms</title>
<link href="https://pro.fontawesome.com/releases/v5.13.1/css/all.css" rel="stylesheet"> 
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js" integrity="sha384-7+zCNj/IqJ95wo16oMtfsKbZ9ccEh31eOz1HGyDuCQ6wgnyJNSYdrPa03rtR1zdB" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous"></script>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<script src="/socket.io/socket.io.js"></script>
</head>
<nav class="navbar navbar-expand-sm navbar-dark" style="background-color:#111214">
  <div class="container-fluid ">
    <a class="navbar-brand" href="/">Doğruluk Cesaret</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-end" id="collapsibleNavbar">
      <ul class="navbar-nav">
        <li class="nav-item">
        <a class="nav-link" href="/">Anasayfa</a>
        </li>
      
      </ul>
    </div>
  </div>
</nav>
<div class="container-fluid">
<div class="row">
<div class="col-md-2">
<div class="container"><br>
<span>Merhaba <%= user.username %></span><br><br>
  <label>Oda oluşturup insanlar ile beraber doğruluk mu cesaret mi oynayabilirsin!</label>
<br><br>
<form action="/create/room/<%= user.token %>" method="POST">
<div class="card">
<div class="card-header">
<h5>Oda oluştur</h5>
</div>
<div class="card-body">
<label>Oda adı</label>
<input type="text" id="roomname" name="roomname" class="form-control">
<label>Oda durumu</label>
<select id="private" name="private" class="form-control">
<option value="false">Herkese açık</option>
<option value="true">Özel</option>
</select>
</div>
<div class="card-footer">
<input type="submit" class="btn btn-primary" value="Oda oluştur">
</div>
</div>
</form>
<br>
<a href="#" style="text-decoration:none">
<div class="btn-group w-100" role="group">
<button class="btn btn-success w-25"><i class="fas fa-redo"></i></button><button class="btn btn-success w-100">Yenile</button>
</div>
</a>
</div>  
</div>
<div class="col-md-10">
<div class="container"><br>
<h4>Aktif odalar</h4>
<hr>
<% if(roomCount < 1){ %>
<div class="hata">
  <i class="far fa-frown hata-icon"></i>
  <h4>Herkese açık bir oda bulunamadı</h4>
  </div>
<% } else { %>
<% rooms.forEach( rooms =>{ %>
<br>
<div class="card">
<div class="card-body">
<h4><%= rooms.roomname %></h4>
</div>  
<div class="card-footer">
<% if(rooms.roomAdminToken == user.token ) { %>
<form method="POST" action="/delete/room/<%= rooms._id %>" style="width:48%; float:left; margin-right:1vw;">
<input type="submit" class="btn btn-danger w-100" value="Odayı Kapat">
</form>
<% } %>
<button class="btn btn-dark w-50" onclick="window.location.href = '/room/<%= rooms.roomurl %>'">
Odaya katıl  
</button>  
</div>
</div><br>
<% }) %>
<% } %>
<h4>Senin odaların</h4>
<hr>
<% if(yourRoomCount < 1){ %>
<div class="hata">
  <i class="far fa-frown hata-icon"></i>
  <h4>Herkese açık bir oda bulunamadı</h4>
  </div>
<% } else { %>
<% yourRooms.forEach( yourRooms =>{ %>
<br>
<div class="card">
<div class="card-body">
<h4><%= yourRooms.roomname %></h4>
</div>  
<div class="card-footer">
<form method="POST" action="/delete/room/<%= yourRooms._id %>" style="width:48%; float:left; margin-right:1vw;">
<input type="submit" class="btn btn-danger w-100" value="Odayı Kapat">
</form>
<button class="btn btn-dark w-50" onclick="window.location.href = '/room/<%= yourRooms.roomurl %>'">
Odaya katıl  
</button>  
</div>
</div>
<% }) %>
<% } %>
</div>
</div>
</div>
</div>
<style>
.hata{
  display:flex;
  flex-wrap:wrap;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  width:100%;
  height:30vh;
}
  .hata-icon{
    font-size:6em;
  }
</style>
