var step_size = 0;
var global_test = 'dsfg vvx0';
var offset = 0;
var stars_angle = 0;

//create canvas for ground, sky, stars, clouds
var primary_scene = document.getElementById('pcanvas');
var primary_scene_context = primary_scene.getContext('2d');

var sky_scene = document.createElement('canvas');
var sky_context = sky_scene.getContext('2d');

var stars_scene = document.createElement('canvas');
var stars_context = stars_scene.getContext('2d');

var ground_scene = document.createElement('canvas');
var ground_context = ground_scene.getContext('2d');

var cloud_scene = document.createElement('canvas');
var cloud_context = cloud_scene.getContext('2d');

var render_int = 16;
var stop_animate = 0;
var frame_index = 0;
var time_update = 0;
var time_pre = 0;
var time_now = 120;

var star_count = 1000;
var star_rd = [];
var star_th = [];
var star_r = [];
var star_g = [];
var star_b = [];
var star_size = [];
var star_tw = [];
var star_tw_sel = 0;

var digit_rd = [];
var digit_th = [];
var digit_lenght = 10;
var digit_offset = 0;
var digit_ul = 770;
var digit_ll = 700;
var digit_th_init = 0;

var cloud_x = [];
var cloud_y = [];
var cloud_a = [];
var cloud_b = [];
var cloud_r = [];
var cloud_g = [];
var cloud_b = [];
var cloud_opacity = [];
var cloud_count = 10;
var cloud_sweep = 0;

var wind_mill_th = 0;

function initialise_stars(sarray,smin,smax){
  var rdmin = 0;
  var rdmax = window.innerWidth;
  var thmin = 0;
  var thmax = 2*Math.PI;

  star_rd.length = star_count;
  star_th.length = star_count;
  star_r.length = star_count;
  star_g.length = star_count;
  star_b.length = star_count;
  star_b.length = star_count;
  star_tw.length = star_count;
  digit_rd.length = 10;
  digit_th.length = 10;

  for (let index = 0;index<star_count;index++) {
    star_rd[index] = rdmin + (rdmax-rdmin)*Math.random();
    star_th[index] = thmin + (thmax-thmin)*Math.random();
    star_r[index] = Math.round(150*Math.random());
    star_g[index] = star_r[index]*(0.8+0.2*Math.random());
    star_b[index] = star_r[index]*(0.8+0.2*Math.random());
    star_size[index] = 1.5*Math.random();
  }
  star_th[43] = digit_th_init;

  /*
  star_rd[41] = 742;
  star_th[41] = 0.085;
  star_th[41] = digit_th_init+0.175;
  star_r[41] = 255;
  star_g[41] = 0;
  star_b[41] = 0;

  star_rd[42] = 728;
  star_th[42] = 0.085;
  star_th[42] = digit_th_init+0.175;
  star_r[42] = 255;
  star_g[42] = 0;
  star_b[42] = 0;
  */
  /*test_star
  star_rd[0] = 500;
  star_th[0] = (Math.PI/180)*0;
  star_r[0] = 255;
  star_g[0] = 0;
  star_b[0] = 0;
  star_size[0] = 5;

  star_rd[1] = 500;
  star_th[1] = (Math.PI/180)*45;
  star_r[1] = 0;
  star_g[1] = 255;
  star_b[1] = 0;
  star_size[1] = 5;

  star_rd[2] = 500;
  star_th[2] = (Math.PI/180)*90;
  star_r[2] = 0;
  star_g[2] = 0;
  star_b[2] = 255;
  star_size[2] = 5;
  */
}

function canvas_loaded(){
  init_canvas();
  init_filter();
  initialise_stars();
  initialise_clouds();
  update_time();
  draw_sky();
  //draw_stars();
  draw_ground();
}

function init_canvas(){
  primary_scene.width = window.innerWidth;
  primary_scene.height = window.innerHeight;
  document.body.style.overflow = "hidden";
  document.body.style.margin = 0;
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function draw_sky(){
  w = window.innerWidth;
  h = window.innerHeight;
  sky_scene.width = w;
  sky_scene.height = h;

  if (frame_index%100==4) {
    for (let index = 0;index<star_count;index++) {
      star_tw[index] = Math.round(0.6*Math.random());
    }
  }
  if (frame_index > 6284) {
    frame_index = 0;
  } else {
    frame_index++;
  }

  var fog = sky_context.createLinearGradient(0,0,0,800);
  fog.addColorStop(0,'#000000');
  fog.addColorStop(0.5,'#000911');
  fog.addColorStop(1,'#070006');
  sky_context.fillStyle = fog;
  sky_context.fillRect(0,0,window.innerWidth,800);
  for (let index=0;index<star_count;index++) {
    var r = g = b = 0;//star_r[index]*(1-star_y[index]/800);
    rd = star_rd[index];
    th = star_th[index];
    x = rd*Math.sin(th);
    y = rd*Math.cos(th);
    star_tw_sel = Math.random();
    if (star_tw_sel < 0.005) {
      r = Math.round(Math.random())*star_r[index]*(1.5-(800-y)/800);
      g = Math.round(Math.random())*star_g[index]*(1.5-(800-y)/800);
      b = Math.round(Math.random())*star_b[index]*(1.5-(800-y)/800);
      s = Math.random()*star_size[index];
    } else {
      r = star_r[index]*(1.5-(800-y)/800);
      g = star_g[index]*(1.5-(800-y)/800);
      b = star_b[index]*(1.5-(800-y)/800);
      s = star_size[index];
    }
    if (index==41 || index==42) {
      //s = 2;
    }
    if (index<40) {
      s = 1;
      if (r<128){
        r = 128;
      }
      if (g<128){
        g = 128;
      }
      if (b<128){
        b = 128;
      }
    }
    /*
    r = star_r[index]*(1.5-(800-y)/800);
    g = star_g[index]*(1.5-(800-y)/800);
    b = star_b[index]*(1.5-(800-y)/800);
    s = star_size[index];
    star_tw_sel = Math.random();
    if (star_tw_sel < 0.02) {
      sky_context.arc(w/2-x,800-y,Math.random()*s,0,2*Math.PI);
    } else {
      sky_context.arc(w/2-x,800-y,s,0,2*Math.PI);
    }
    */
    sky_context.beginPath();
    sky_context.arc(w/2-x,800-y,s,0,2*Math.PI);
    sky_context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    if (star_th[43]<2*Math.PI-0.3) {
      if (star_th[index]<star_th[43]){
        sky_context.fill();
      }
      if (star_th[index]>star_th[43]+0.3){
        sky_context.fill();
      }
    } else if (star_th[43] > 2*Math.PI-0.3) {
      if ((star_th[index] > 0.3-(2*Math.PI-star_th[43])) && (star_th[index] < star_th[43])) {
        sky_context.fill();
      }
    }
    if (star_rd[index] > digit_ul || star_rd[index] < digit_ll) {
      sky_context.fill();
    }
    if (index < 39) {
      sky_context.fill();
    }
    if (r>250 || g > 250 || b > 250) {
      //console.log(r,g,b);
    }
    //sky_context.fill();
    star_th[index] = star_th[index]-0.001;
    if (star_th[index]<0) {
      star_th[index] = 2*Math.PI;
    }
    for (let index=0;index<digit_lenght*4;index++) {
      if (star_rd[index]>1 && star_rd[index+1]>1){
        x1 = star_rd[index]*Math.sin(star_th[index]);
        y1 = star_rd[index]*Math.cos(star_th[index]);
        x2 = star_rd[index+1]*Math.sin(star_th[index+1]);
        y2 = star_rd[index+1]*Math.cos(star_th[index+1]);
        sky_context.beginPath();
        sky_context.strokeStyle = '#333333';
        //sky_context.setLineDash([1, 50]);
        sky_context.lineWidth=0.1;
        sky_context.moveTo(w/2-x1,800-y1);
        sky_context.lineTo(w/2-x2,800-y2);
        sky_context.stroke();
        //console.log(x1," ",y1," ",x2," ",y2," ",);
      }
    }
    if (star_th[43] < 2*Math.PI-1.57 && star_th[43] > 1.25) {
      star_th[43] = 1.25;
      update_time();
      console.log('star_th[43]');
    }
  }
  primary_scene_context.drawImage(sky_scene,0,0,window.innerWidth,window.innerHeight);
  rotate_stars();
}

function draw_stars(){
  stars_scene.width = window.innerWidth;
  stars_scene.height = window.innerHeight;
  for (let index=0;index<star_count;index++) {
    var r = g = b = 255*(1-star_y[index]/800);
    r = r*(0.8+0.2*Math.random());
    g = g*(0.8+0.2*Math.random());
    b = b*(0.8+0.2*Math.random());
    //var r = g = b = 255*(1-star_y[index]/800);
    stars_context.beginPath();
    stars_context.arc(star_x[index],star_y[index],1.5*Math.random(),0,2*Math.PI);
    stars_context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    stars_context.rotate(stars_angle);
    stars_angle++;
    stars_context.fill();
  }
  for (let index=0;index<digit_lenght;index++) {
    x1 = star_rd[index]*sin(star_th[index]);
    y1 = star_rd[index]*con(star_th[index]);
    x2 = star_rd[index+1]*sin(star_th[index+1]);
    y2 = star_rd[index+1]*con(star_th[index]+1);
    stars_context.beginPath();
    stars_context.moveTo(x1,y1);
    stars_context.lineTo(x2,y2);
    //stars_context.fillStyle = rgb(255,0,0);
    stars_context.strokeStyle = "red";
    stars_context.lineDashOffset = 10;
    stars_context.stroke;
    console.log(x1," ",y1," ",x2," ",y2," ",);
  }
  primary_scene_context.drawImage(stars_scene,0,0,window.innerWidth,window.innerHeight);
  rotate_stars();
}

function update_time(){
  time_pre = time_now;
  var current_time = new Date();
  var current_hour = current_time.getHours();
  var current_min = current_time.getMinutes();
  var H1,H2,M1,M2 = 0;
  H1 = Math.floor(current_hour/10);
  H2 = current_hour%10;
  M1 = Math.floor(current_min/10);
  M2 = current_min%10;
  data_copy(H1,3);
  data_copy(H2,2);
  data_copy(M1,1);
  data_copy(M2,0);
}

function data_copy(digit,place){
  if (digit==1) {
    digit_rd = [495,500,495,487,480,0,0,0,0,0];
    digit_th = [0.02,0.01,0.01,0.01,0.01,0.01,0,0,0,0];
  } else if (digit==2) {
    digit_rd = [495,500,495,490,485,480,480,480,0,0];
    digit_th = [0.02,0.01,0.00,0.01,0.02,0.03,0.01,0.00,0,0];
  } else if (digit==3) {
    digit_rd = [500,500,495,490,485,480,480,0,0,0,0];
    digit_th = [0.02,0.01,0.00,0.01,0.00,0.01,0.022,0.00,0.00,0];
  } else if (digit==4) {
    digit_rd = [480,492,500,492,485,485,485,485,0,0];
    digit_th = [0.01,0.01,0.01,0.02,0.03,0.02,0.01,0.00,0,0];
  } else if (digit==5) {
    digit_rd = [500,499,491,491,486,481,481,0,0,0,0];
    digit_th = [0.01,0.025,0.025,0.01,0.00,0.01,0.025,0.00,0.00,0];
  } else if (digit==6) {
    digit_rd = [500,495,490,485,482,485,490,493,0,0,0];
    digit_th = [0.01,0.015,0.02,0.02,0.01,0.00,0,0.01,0,0];
  } else if (digit==7) {
    digit_rd = [500,500,500,495,490,481,0,0,0,0,0];
    digit_th = [0.02,0.01,0.00,0.005,0.01,0.015,0,0,0,0];
  } else if (digit==8) {
    digit_rd = [490,495,500,495,485,480,485,490,0,0,0];
    digit_th = [0.01,0.00,0.01,0.02,0.00,0.01,0.02,0.01,0,0,0];
  } else if (digit==9) {
    digit_rd = [490,490,495,500,500,495,490,485,480,0,0,0];
    digit_th = [0.00,0.015,0.02,0.015,0.005,0.00,0.00,0.005,0.01,0,0,0];
  } else if (digit==0) {
    digit_rd = [500,497,488,483,488,497,500,0,0,0];
    digit_rd = [500,495,485,480,485,495,500,0,0,0];
    digit_th = [0.01,0.02,0.02,0.01,0.00,0.00,0.01,0,0,0];
  }

  for (index=0;index<digit_lenght;index++) {
    star_rd[index+place*10] = 1.5*digit_rd[index];
    star_th[index+place*10] = star_th[43]+digit_th[index]+(place+1)*0.05;
    star_size[index+place*10] = 1.3;
    //star_r[index+place*10] = 255;
    //star_b[index+place*10] = 0;
    //star_g[index+place*10] = 0;
  }
}

async function rotate_stars(){
  if (stop_animate == 1) {
    await sleep(1000);
    rotate_stars();
    return 0;
  } else if (stop_animate == 2) {
    await sleep(16);
    step_size++;
    if (step_size > 20) {
      stop_animate = 1;
      step_size = 0;
    }
    draw_sky();
    //draw_time();
    draw_ground();
    return 0;
  } else {
    await sleep(render_int);
    draw_sky();
    time_now = Date.now();
    if (time_now - time_pre > 60000) {
      update_time();
    }
    draw_clouds();
    draw_ground();
  }
  /*
  stars_context.rotate(stars_angle);
  stars_angle = stars_angle+1;
  stars_context.fill();
  stars_context.rotate(stars_angle);
  primary_scene_context.drawImage(stars_scene,0,0,window.innerWidth,window.innerHeight);
  rotate_stars();
  */
}


function draw_ground(){
  ground_scene.width = window.innerWidth;
  ground_scene.height = window.innerHeight;

  draw_windmill();

  ground_context.beginPath();
  ground_context.moveTo(offset,800);
  ground_context.bezierCurveTo(0.4*window.innerWidth,450,0.5*window.innerWidth,500,window.innerWidth-offset,750);
  ground_context.lineTo(window.innerWidth-offset,window.innerHeight-offset);
  ground_context.lineTo(offset,window.innerHeight-10);
  ground_context.lineTo(offset,800);
  ground_context.strokeStyle = '#ff0000';
  ground_context.fillStyle = '#040404';
  ground_context.fill();
  //ground_context.stroke();

  ground_context.beginPath();
  ground_context.moveTo(offset,600);
  ground_context.bezierCurveTo(0.3*window.innerWidth,550,0.3*window.innerWidth,700,window.innerWidth-offset,800);
  ground_context.lineTo(window.innerWidth-offset,window.innerHeight-offset);
  ground_context.lineTo(offset,window.innerHeight-10);
  ground_context.lineTo(offset,600);
  ground_context.strokeStyle = '#00ff00';
  ground_context.fillStyle = '#030303';
  ground_context.fill();
  //ground_context.stroke();

  ground_context.beginPath();
  ground_context.moveTo(offset,700);
  ground_context.bezierCurveTo(0.4*window.innerWidth,850,0.8*window.innerWidth,550,window.innerWidth-offset,650);
  ground_context.lineTo(window.innerWidth-offset,window.innerHeight-offset);
  ground_context.lineTo(offset,window.innerHeight-offset);
  ground_context.lineTo(offset,800);
  ground_context.strokeStyle = '#ff0000';
  ground_context.fillStyle = '#020202';
  ground_context.fill();
  //ground_context.stroke();

  primary_scene_context.drawImage(ground_scene,0,0,window.innerWidth,window.innerHeight);
}

function init_filter(){
  const SVG_NS = 'http://www.w3.org/2000/svg';

  let testfilter = document.createElementNS(SVG_NS, 'filter');
  testfilter.setAttribute("id","filter1");

  let turbulence =document.createElementNS(SVG_NS, 'feTurbulence');
  turbulence.setAttributeNS(null,"type","fractalNoise");
  turbulence.setAttributeNS(null,"baseFrequency",".01");
  turbulence.setAttributeNS(null,"numOctaves","10");
  turbulence.setAttributeNS(null,"seed","85187");

  var dispMap = document.createElementNS(SVG_NS, 'feDisplacementMap');
  dispMap.setAttributeNS(null,"in", "SourceGraphic");
  dispMap.setAttributeNS(null,"scale", "240");

  testfilter.appendChild(turbulence);
  testfilter.appendChild(dispMap);
  pfilter.appendChild(testfilter);
}

function initialise_clouds(){
  var xmin = 0;
  var xmax = window.innerWidth;
  var ymin = 0;
  var ymax = 100;
  var amin = 200;
  var amax = 400;
  var bmin = 50;
  var bmax = 100;

  cloud_x.length = cloud_count;
  cloud_y.length = cloud_count;
  cloud_a.length = cloud_count;
  cloud_b.length = cloud_count;
  cloud_r.length = cloud_count;
  cloud_g.length = cloud_count;
  cloud_b.length = cloud_count;
  cloud_opacity.length = cloud_count;

  for (let index = 0;index<cloud_count;index++) {
    cloud_x[index] = xmin + (xmax-xmin)*Math.random();
    cloud_y[index] = ymin + (ymax-ymin)*Math.random();
    cloud_a[index] = amin + (amax-amin)*Math.random();
    cloud_b[index] = bmin + (bmax-bmin)*Math.random();
  }
  set_clouds();
}

function draw_cloud_dynamic() {
  /*
  sky_context.fillStyle = "#333333";
  sky_context.beginPath();
  sky_context.rect(0,0,600,100);
  sky_context.filter = "blur(20px) url(#filter1) drop-shadow(20px 20px 1px #111111) blur(1px) opacity(60%)";
  sky_context.fill();
  */

  for (let index = 0;index<cloud_count;index++) {
    sky_context.beginPath();
    sky_context.roundRect(cloud_x[index],cloud_y[index],cloud_a[index],cloud_b[index],50);
    //sky_context.filter = "blur(20px) url(#filter1) drop-shadow(20px 20px 1px #111111) blur(1px) opacity(30%)";
    sky_context.filter = "opacity(50%) blur(20px)";
    sky_context.fill();
    cloud_x[index] = cloud_x[index]+index%2+1;
    if (cloud_x[index] > window.innerWidth) {
      cloud_x[index] = 0;
    }
  }

  primary_scene_context.drawImage(sky_scene,0,0,window.innerWidth,window.innerHeight);
}

function set_clouds() {
  cloud_scene.width = window.innerWidth;
  cloud_scene.height = window.innerHeight;
  for (let index = 0;index<cloud_count;index++) {
    cloud_context.fillStyle = "#333333";
    cloud_context.beginPath();
    cloud_context.roundRect(cloud_x[index],cloud_y[index],cloud_a[index],cloud_b[index],50);
    cloud_context.filter = "blur(20px) url(#filter1) drop-shadow(20px 20px 1px #111111) blur(1px) opacity(30%)";
    //cloud_context.filter = "url(#filter1)";
    if (cloud_x[index]+cloud_a[index]+30<window.innerWidth) {
      cloud_context.fill();
    }
    //cloud_x[index] = cloud_x[index]+index%2+1;
  }

  //primary_scene_context.drawImage(cloud_scene,0,0,window.innerWidth,window.innerHeight);
}

function draw_clouds() {
  primary_scene_context.drawImage(cloud_scene,cloud_sweep-window.innerWidth,-50,window.innerWidth,window.innerHeight);
  primary_scene_context.drawImage(cloud_scene,cloud_sweep,-50,window.innerWidth,window.innerHeight);
  cloud_sweep++;
  if (cloud_sweep>window.innerWidth) {
    cloud_sweep = 0;
  }
}

function draw_windmill() {
  ground_context.strokeStyle = '#020202';
  ground_context.fillStyle = '#020202';
  //ground_context.strokeStyle = '#ffffff';
  //ground_context.fillStyle = '#ffffff';
  ground_context.lineWidth = 4;

  ground_context.beginPath();
  ground_context.moveTo(100,600);
  ground_context.lineTo(120,450);
  ground_context.lineTo(125,450);
  ground_context.lineTo(115,600);
  ground_context.lineTo(150,600);
  ground_context.lineTo(140,450);
  ground_context.lineTo(145,450);
  ground_context.lineTo(160,600);
  ground_context.stroke();

  ground_context.beginPath();
  ground_context.moveTo(105,561);
  ground_context.lineTo(147,561);
  ground_context.lineTo(155,556);
  ground_context.lineTo(118,556);
  ground_context.lineTo(105,561);
  ground_context.stroke();

  ground_context.beginPath();
  ground_context.moveTo(110,524);
  ground_context.lineTo(145,524);
  ground_context.lineTo(152,519);
  ground_context.lineTo(120,519);
  ground_context.lineTo(110,524);
  ground_context.stroke();

  ground_context.beginPath();
  ground_context.moveTo(115,487);
  ground_context.lineTo(143,487);
  ground_context.lineTo(150,482);
  ground_context.lineTo(122,482);
  ground_context.lineTo(115,487);
  ground_context.stroke();

  ground_context.beginPath();
  ground_context.moveTo(110,450);
  ground_context.lineTo(152,450);
  ground_context.lineTo(155,445);
  ground_context.lineTo(115,445);
  ground_context.lineTo(110,450);
  ground_context.fill();

  ground_context.beginPath();
  ground_context.rect(125,417,15,30);
  ground_context.fill();

  ground_context.beginPath();
  r = 128;
  g = 97;
  b = 20;
  w = 20*Math.random();
  r = r-w;
  g = g-w;
  b = b-w;
  rgb = "rgb(" + r + "," + g + "," + b + ")";
  ground_context.fillStyle = rgb;
  ground_context.rect(130,437,5,8);
  ground_context.fill();


  ground_context.fillStyle = '#020202';
  ground_context.beginPath();
  ground_context.arc(132.5,417,10,0,2*Math.PI);
  ground_context.fill();

  ground_context.lineWidth = 4;
  ground_context.beginPath();
  ground_context.arc(132.5,417,15,0,2*Math.PI);
  ground_context.arc(132.5,417,40,0,2*Math.PI);
  ground_context.arc(132.5,417,60,0,2*Math.PI);
  ground_context.stroke();

  ground_context.beginPath();
  ground_context.moveTo(132.5,417);
  ground_context.lineTo(215,417);
  ground_context.lineTo(225,400);
  ground_context.lineTo(255,397);
  ground_context.lineTo(256,420);
  ground_context.lineTo(132.5,420);
  ground_context.fill();

  var x1 = 132.5;
  var y1 = 417;
  var r1 = 75;
  var r2 = 30;
  var r3 = 5;

  //ground_context.fillStyle = '#ff0000';
  for (let index=0;index<16;index++) {
    th_sweep = ((2*Math.PI)*(index))/(16);
    ground_context.beginPath();
    ground_context.moveTo(x1,y1);
    ground_context.lineTo(x1+r1*Math.sin(wind_mill_th+index*2*Math.PI/16),y1+r1*Math.cos(wind_mill_th+index*2*Math.PI/16));
    ground_context.lineTo(x1+r1*Math.sin(-0.2+wind_mill_th+index*2*Math.PI/16),y1+r1*Math.cos(-0.2+wind_mill_th+index*2*Math.PI/16));
    ground_context.lineTo(x1+r2*Math.sin(-0.2+wind_mill_th+index*2*Math.PI/16),y1+r2*Math.cos(-0.2+wind_mill_th+index*2*Math.PI/16));
    ground_context.lineTo(x1+r2*Math.sin(-0.1+wind_mill_th+index*2*Math.PI/16),y1+r2*Math.cos(-0.1+wind_mill_th+index*2*Math.PI/16));
    ground_context.lineTo(x1,y1);
    ground_context.fill();
  }
  wind_mill_th = wind_mill_th + 0.02;
  primary_scene_context.drawImage(ground_scene,0,0,window.innerWidth,window.innerHeight);
}
