
 

function getAverageRGB(imgEl) {
 
 var blockSize = 5, // only visit every 5 pixels
     defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
     canvas = document.createElement('canvas'),
     context = canvas.getContext && canvas.getContext('2d'),
     data, width, height,
     i = -4,
     length,
     rgb = {r:0,g:0,b:0},
     count = 0;
     
 if (!context) {
     return defaultRGB;
 }
 
 height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
 width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
 
 context.drawImage(imgEl, 0, 0);
 
 try {
     data = context.getImageData(0, 0, width, height);
 } catch(e) {
     /* security error, img on diff domain */alert('x');
     return defaultRGB;
 }
 
 length = data.data.length;
 
 while ( (i += blockSize * 4) < length ) {
     ++count;
     rgb.r += data.data[i];
     rgb.g += data.data[i+1];
     rgb.b += data.data[i+2];
 }
 
 // ~~ used to floor values
 rgb.r = ~~(rgb.r/count);
 rgb.g = ~~(rgb.g/count);
 rgb.b = ~~(rgb.b/count);
 
 return rgb;
 
}

function fail_load(img){
  img.src="image/oop.PNG"
}
function beauty(){
  'use strict';

  Vue.config.devtools = true;
  
  Vue.component('card', {
    template: '\n    <div class="card-wrap"\n      @mousemove="handleMouseMove"\n      @mouseenter="handleMouseEnter"\n      @mouseleave="handleMouseLeave"\n      ref="card">\n      <div class="card"\n        :style="cardStyle">\n        <div class="card-bg" :style="[cardBgTransform, cardBgImage]"></div>\n        <div class="card-info">\n          <slot name="header"></slot>\n          <slot name="content"></slot>\n        </div>\n      </div>\n    </div>',
    mounted: function mounted() {
      this.width = this.$refs.card.offsetWidth;
      this.height = this.$refs.card.offsetHeight;
    },
  
    props: ['dataImage'],
    data: function data() {
      return {
        width: 0,
        height: 0,
        mouseX: 0,
        mouseY: 0,
        mouseLeaveDelay: null
      };
    },
    computed: {
      mousePX: function mousePX() {
        return  (this.mouseX)/this.width;
      },
      mousePY: function mousePY() {
        return (this.mouseY)/this.height;
       
      },
      cardStyle: function cardStyle() {
        var rX = this.mousePX * 30;
        var rY = this.mousePY * -30;
        return {
          transform: 'rotateY(' + rX + 'deg) rotateX(' + rY + 'deg)'
        };
      },
      cardBgTransform: function cardBgTransform() {
        var tX = this.mousePX * -40;
        var tY = this.mousePY * -40;
        return {
          transform: 'translateX(' + tX + 'px) translateY(' + tY + 'px)'
        };
      },
      cardBgImage: function cardBgImage() {
        return {
          backgroundImage: 'url(' + this.dataImage + ')'
        };
      }
    },
    methods: {
      handleMouseMove: function handleMouseMove(e) {
        this.mouseX = e.pageX - this.$refs.card.offsetLeft+this.$refs.card.parentElement.parentElement.scrollLeft - this.width / 2;
        this.mouseY = e.pageY - this.$refs.card.offsetTop+this.$refs.card.parentElement.parentElement.scrollTop - this.height / 2;
       
      },
      handleMouseEnter: function handleMouseEnter() {
        clearTimeout(this.mouseLeaveDelay);
      },
      handleMouseLeave: function handleMouseLeave() {
        var _this = this;
  
        this.mouseLeaveDelay = setTimeout(function () {
          _this.mouseX = 0;
          _this.mouseY = 0;
        }, 1000);
      }
    }
  });
  
  var app = new Vue({
    el: '#app'
  });
}

async function load_review(id,page){
  $('#pareview').empty();
    $('#review').empty();
    const raw_review = await fetch(`https://api.themoviedb.org/3/movie/${id}/reviews?api_key=40c02c95ac86c587a562fbbafdd4f0b2&language=en-US&page=${page}`);
    const review = await raw_review.json();
    $("#review").append(`<h3 style="color:white;">Review</h3>`);
  for(r of review.results){
    $("#review").append(`
    <div style="color:white;">
    <h4>${r.author}</h3>
    <p>${r.content}</p>
    </div>
    `);
  }
  let total_pages = review.total_pages;
    let start = Math.floor((page-1)/10)*10+1;
    let end = start+9;
    let dis = "";
    let act = "";
    if(start==1)
      dis = "disabled";
    $('#pareview').append(`
    <li><a href="#" class="${dis}" onclick="load_review('${id}',${1})">First</a></li>
      <li>
          <a href="#" class="${dis}" onclick="load_review('${id}',${start-1})">
            <span aria-hidden="true">&laquo;</span>
           
          </a>
        </li>`);
    dis = "";
    for(let i=start;i<=end;i++){
      if(i==page)
        act = "disabled active";
      else
        act = "";
      $('#pareview').append(`
      <li><a href="#" class="${act}" onclick="load_review('${id}',${i})">${i}</a></li>`);

      if(i==total_pages){
        dis = " disabled";
        break;
      }
      
    }
    $('#pareview').append(`
    <li>
    <a href="#" class="${dis}" onclick="load_review('${id}',${end+1})">
      <span aria-hidden="true">&raquo;</span>
    </a>
  </li>
  <li><a href="#" class="${dis}" onclick="load_review('${id}',${total_pages})">Last</a></li>`);


}
async function load_movie(id){
  $('#pareview').empty();
    $('#review').empty();
  $('#app').empty();
  $('#pagination').empty();
  let a = document.getElementsByClassName("active")[0];
  if(a)
    a.className = a.className.slice(0,-7);
  
  const movie = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=40c02c95ac86c587a562fbbafdd4f0b2&language=en-US`);
  const movie_info = await movie.json();
 
  const cast_crew = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=40c02c95ac86c587a562fbbafdd4f0b2`);
  const cast_crew_info = await cast_crew.json();
  
  const cast = cast_crew_info.cast;
  const crew = cast_crew_info.crew;
  let director = "";
  for(c of crew){
    if(c.job == 'Director'){
      director+=c.name+',';
    }
  }
  director = director.slice(0,-1);
  let year = movie_info.release_date.slice(0,4);
  let genres = "";
  for(g of movie_info.genres){
    genres += g.name+",";
   
  }
  genres = genres.slice(0,-1);
  $('#app').append(`
  
  <div class="row justify-content-around" style="margin-top:80px;color:white;">
  <div class="col-2">
    <img src="https://image.tmdb.org/t/p/w500${movie_info.poster_path}" onerror="fail_load(this)" id="i" width="300">
  </div>
  <div class="col-6">
    <h1 class="text-success">${movie_info.title} (${year})</h1>
    <p>Rated: ${movie_info.vote_average} by ${movie_info.vote_count} users</p>
    <p>Length: ${movie_info.runtime} min</p>
    <p>Genres: ${genres}</p>
    <p>Director: ${director}</p> 
    <h3>Over view</h3>
    <p>${movie_info.overview}</p>
  </div>
  </div>
  `);

  
  $("#app").append(`
  <h3 style="margin-top:100px;color:white;">Actors</h3>
  <div style=" width: 100%;height: 350px;">
  <div id="app-movie" class="container1" style="height: 100%;display:block;overflow-x: scroll;overflow-y:hidden;vertical-align: top;white-space: nowrap;"   ></div>
  </div>
  `);
  for(actor of cast){
    let img_src = "https://image.tmdb.org/t/p/w500"+actor.profile_path;
    if(actor.profile_path==null){
      img_src="image/oop.PNG";
    }
    $("#app-movie").append(
    `<a class="scroll" onclick="load_actor(${actor.id})">
    <card data-image=${img_src}>
    <p slot="header" style="font-size:15px;">${actor.name}</p>
    <p class="as" slot="content">as</p>
    <p slot="content" style="font-size:12px;">${actor.character}</p>
  </card></a>`);
    
  }

  load_review(movie_info.id,1);
  
  beauty();
 // var rgb = getAverageRGB(document.getElementById('i'));
 //document.body.style.backgroundColor = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
}
async function load_actor(id){
  $('#app').empty();
  $('#pagination').empty();
  $('#pareview').empty();
    $('#review').empty();
  
  console.log(id);
  const actor = await fetch(`https://api.themoviedb.org/3/person/${id}?api_key=40c02c95ac86c587a562fbbafdd4f0b2&language=en-US`);
  const actor_info = await actor.json();
 console.log(actor_info);
 let gender = 'Female';
 if(actor_info.gender == 2){
   gender = "Male";
 }
 let nick_name = "";
 if((actor_info.also_known_as) && (actor_info.also_known_as[0] != undefined)){
   nick_name = " ("+actor_info.also_known_as[0]+")";
 }
 let bio = "";
 let ww = 2;
 if((actor_info.biography) && (actor_info.biography != undefined)){
  bio = actor_info.biography;
 
}else{
  bio = "We do not have biography for this actor";
  ww = 6;
}
  $('#app').append(`
  
  <div class="row justify-content-around" style="margin-top:80px;color:white;">
  <div class="col-${ww}">
    <img src="https://image.tmdb.org/t/p/w500${actor_info.profile_path}" onerror="fail_load(this)" id="i" width="300">
  </div>
  <div class="col-6">
    <h1 class="text-success">${actor_info.name}${nick_name}</h1>
    <p>Known for: ${actor_info.known_for_department}</p>
    <p>Gender: ${gender}</p>
    <p>Birth day: ${actor_info.birthday}</p>
    <p>Place of birth: ${actor_info.place_of_birth}</p>
    <h3>Biography</h3>
    <p>${bio}</p>
  </div>
  </div>
  `);

  const raw_credit = await fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=40c02c95ac86c587a562fbbafdd4f0b2&language=en-US`);
  const credit = await raw_credit.json();
  $("#app").append(`
  <h3 style="margin-top:100px;color:white;">Cast</h3>
  <div style=" width: 100%;height: 350px;">
  <div id="app-movie" class="container1" style="height: 100%;display:block;overflow-x: scroll;overflow-y:hidden;vertical-align: top;white-space: nowrap;"   ></div>
  </div>
  `);
  for(c of credit.cast){
    let img_src = "https://image.tmdb.org/t/p/w500"+c.poster_path;
    if(c.poster_path==null){
      img_src="image/oop.PNG";
    }
    $("#app-movie").append(`
    <a class="scroll" onclick="load_movie(${c.id})">
    <card data-image=${img_src}>
    <p slot="header" style="font-size:15px;">${c.title}</p>
    <p slot="content" style="font-size:12px;">${c.release_date}</p>
  </card></a>`);
    
  }
  beauty();
}
function fill_movie(movies){

 
  for(const movie of movies.results){
    let img_src = "https://image.tmdb.org/t/p/w500"+movie.poster_path;
    if(movie.poster_path==null){
      img_src="image/oop.PNG";
    }
    $('#app').append(`
    <a onclick="load_movie(${movie.id})">
    <card data-image=${img_src}>
    <p slot="header" style="font-size:15px;">${movie.title}</>
    <p slot="content" style="font-size:12px;">${movie.release_date}</p>
  </card></a>
    `);
}
}
function fill_actor(actors){
  $("#actor-no").append(`<h2>Search 
  <span class="glyphicons glyphicons-chevron-right x1 breadcrumb"></span>
   Actor Results</h2>`);
   for(const actor of actors.results){
    let img_src = "https://image.tmdb.org/t/p/w500"+actor.poster_path;
    if(actor.poster_path==null){
      img_src="image/oop.PNG";
    }
    $('#actor-result').append(`
    <a onclick="load_actor(${actor.id})">
    <card data-image=${img_src}>
    <p slot="header" style="font-size:15px;">${actor.name}</>
   
  </card></a>
    `);
}
}
async function search_actor(key_search, page){
  $("#actor-result").empty();
  const raw_actor = await fetch(`https://api.themoviedb.org/3/search/person?api_key=40c02c95ac86c587a562fbbafdd4f0b2&language=en-US&query=${key_search}&page=${page}&include_adult=false`);
  const actors = await raw_actor.json();
  fill_actor(actors);
  let total_pages = actors.total_pages;
  let start = Math.floor((page-1)/10)*10+1;
  let end = start+9;
  let dis = "";
  let act = "";
  if(start==1)
    dis = "disabled";
  $('#paactor').append(`
  <li><a href="#" class="${dis}" onclick="search_actor('${key_search}',${1})">First</a></li>
    <li>
        <a href="#" class="${dis}" onclick="search_actor('${key_search}',${start-1})">
          <span aria-hidden="true">&laquo;</span>
         
        </a>
      </li>`);
  dis = "";
  for(let i=start;i<=end;i++){
    if(i==page)
      act = "disabled active";
    else
      act = "";
    $('#paactor').append(`
    <li><a href="#" class="${act}" onclick="search_actor('${key_search}',${i})">${i}</a></li>`);

    if(i==total_pages){
      dis = " disabled";
      break;
    }
    
  }
  $('#paactor').append(`
  <li>
  <a href="#" class="${dis}" onclick="search_actor('${key_search}',${end+1})">
    <span aria-hidden="true">&raquo;</span>
  </a>
</li>
<li><a href="#" class="${dis}" onclick="search_actor('${key_search}',${total_pages})">Last</a></li>`);
}

async function run(type, page){
  let key_search = document.getElementById("search_input").value;
  if(key_search=="" && type=="i") type="popular";
  $('#app').empty();
 
  $('#app').append(`
  <img src="image/loader.svg" width="200px" height="200px">
  `);
    let url;
    switch(type){
        case "now-playing": url = `https://api.themoviedb.org/3/movie/now_playing?api_key=40c02c95ac86c587a562fbbafdd4f0b2&language=en-US&page=${page}`;break;
        case "popular": url = `https://api.themoviedb.org/3/movie/popular?api_key=40c02c95ac86c587a562fbbafdd4f0b2&language=en-US&page=${page}`;break;
        case "top-rated": url = `https://api.themoviedb.org/3/movie/top_rated?api_key=40c02c95ac86c587a562fbbafdd4f0b2&language=en-US&page=${page}`; break;
        case "upcoming": url = `https://api.themoviedb.org/3/movie/upcoming?api_key=40c02c95ac86c587a562fbbafdd4f0b2&language=en-US&page=${page}`; break;
        default:
            {
                let key_search = document.getElementById("search_input").value;
                url = `https://api.themoviedb.org/3/search/movie?api_key=40c02c95ac86c587a562fbbafdd4f0b2&language=en-US&query=${key_search}&page=${page}&include_adult=false`;
                break;
            }
    }
    let a = document.getElementsByClassName("active")[0];
    if(a)
      a.className = a.className.slice(0,-7);
    if(type!="i"){
    a = document.getElementById(type);
    a.className+=' active';
  }
    const list_movies = await fetch(url);
    const movies = await list_movies.json();
    $('#app').empty();
    fill_movie(movies);

    

    $('#pagination').empty();
    $('#pareview').empty();
    $('#review').empty();

    let total_pages = movies.total_pages;
    let start = Math.floor((page-1)/10)*10+1;
    let end = start+9;
    let dis = "";
    let act = "";
    if(start==1)
      dis = "disabled";
    $('#pagination').append(`
    <li><a href="#" class="${dis}" onclick="run('${type}',${1})">First</a></li>
      <li>
          <a href="#" class="${dis}" onclick="run('${type}',${start-1})">
            <span aria-hidden="true">&laquo;</span>
           
          </a>
        </li>`);
    dis = "";
    for(let i=start;i<=end;i++){
      if(i==page)
        act = "disabled active";
      else
        act = "";
      $('#pagination').append(`
      <li><a href="#" class="${act}" onclick="run('${type}',${i})">${i}</a></li>`);

      if(i==total_pages){
        dis = " disabled";
        break;
      }
      
    }
    $('#pagination').append(`
    <li>
    <a href="#" class="${dis}" onclick="run('${type}',${end+1})">
      <span aria-hidden="true">&raquo;</span>
    </a>
  </li>
  <li><a href="#" class="${dis}" onclick="run('${type}',${total_pages})">Last</a></li>`);
    //search_actor(key_search,1);
  
    beauty();
  }