function GUI(e,t){var e=e;var t=t;var n;var r=document.querySelector("#intentos");var s=document.querySelector("#progreso");var o=document.querySelector("#letra");var u=document.querySelector("#victoria");var a=document.querySelector("#derrota");var f=document.querySelector("#alerta-borrar");var l=document.querySelector("#alerta-nombre");var c=document.querySelector("#puntos-victoria");var h=document.querySelector("#puntos-derrota");var p=document.querySelector("#nombre-usuario");p.innerHTML=t.get_nombre_jugador();var d=document.querySelector("#nivel-usuario");var v=document.querySelector("#puntos-usuario");var m=document.querySelector("#proximo-nivel");var g=document.querySelector("#partidas-usuario");var y=document.querySelector("#aciertos-usuario");var b=document.querySelector("#errores-usuario");this.actualizar_datos=function(){d.innerHTML=t.get_nivel();v.innerHTML=t.get_puntos();m.innerHTML=t.get_puntos_proximo_nivel();g.innerHTML=t.get_partidas();y.innerHTML=t.get_aciertos();b.innerHTML=t.get_errores()};this.actualizar_datos();var w=document.querySelector("#usuario");var E=[];for(i=0;i<7;i++){E[i]=document.querySelector("#img"+i)}this.set_intentos=function(e){r.innerHTML=e};this.set_progreso=function(e){s.innerHTML=e};this.dibujar_ahorcado=function(e){switch(e){case 0:E[5].style.display="block";case 1:E[4].style.display="block";case 2:E[3].style.display="block";case 3:E[2].style.display="block";case 4:E[1].style.display="block";case 5:E[0].style.display="block"}};this.nuevo_juego=function(){n=new Juego(e.get_palabra());this.set_intentos(n.get_intentos());this.set_progreso(n.get_progreso());for(i=0;i<6;i++){E[i].style.display="none"}this.borrar_alertas();o.focus()};this.terminar_juego=function(){puntos=n.terminar_juego();t.add_puntos(puntos);t.sumar_partida();t.set_nivel();datos_jugador=t.get_datos();localStorage.setItem("datos_jugador",JSON.stringify(datos_jugador));this.actualizar_datos();if(puntos>0){c.innerHTML=puntos;u.style.display="block"}else{h.innerHTML=puntos;a.style.display="block"}};this.jugar_letra=function(){if(!n.get_juego_finalizado()){letra=o.value[0];resultados=n.probar_letra(letra);t.sumar_error(resultados["errores"]);t.sumar_acierto(resultados["aciertos"]);this.dibujar_ahorcado(n.get_vidas());if(n.get_vidas()<1||n.get_restantes()<1){this.terminar_juego()}this.set_intentos(n.get_intentos());this.set_progreso(n.get_progreso())}o.value="";o.focus()};this.pulsa_tecla=function(e){switch(e.keyCode){case 13:this.jugar_letra();break;case 38:this.nuevo_juego();break}};this.cambiar_nombre=function(e){if(e){nombre=w.value;if(nombre!=""){t.set_nombre_jugador(nombre);datos_jugador=t.get_datos();localStorage.setItem("datos_jugador",JSON.stringify(datos_jugador));p.innerHTML=nombre}this.borrar_alertas();l.style.display="block"}w.value=""};this.borrar_datos=function(){datos_jugador={nombre_jugador:"Anonimo",nivel:"1",puntos:"0",partidas:"0",aciertos:"0",errores:"0"};t=new Jugador(datos_jugador);localStorage.setItem("datos_jugador",JSON.stringify(datos_jugador));p.innerHTML=t.get_nombre_jugador();this.actualizar_datos();this.borrar_alertas();f.style.display="block"};this.borrar_alertas=function(){u.style.display="none";a.style.display="none";f.style.display="none";l.style.display="none"}}function init(){palabras=new Palabras(lista_palabras);if(localStorage.getItem("datos_jugador")!=undefined){datos_jugador=JSON.parse(localStorage.getItem("datos_jugador"))}else{datos_jugador={nombre_jugador:"Anonimo",nivel:"1",puntos:"0",partidas:"0",aciertos:"0",errores:"0"};localStorage.setItem("datos_jugador",JSON.stringify(datos_jugador))}jugador=new Jugador(datos_jugador);gui=new GUI(palabras,jugador);gui.nuevo_juego();$('[data-toggle="tooltip"]').tooltip()}var Palabras=function(e){var e=e.split(" ");this.get_cantidad=function(){return e.length};this.get_palabra=function(){rand=Math.floor(Math.random()*this.get_cantidad());return e[rand]}};var Jugador=function(e){var t=e["nombre_jugador"];var n=parseInt(e["nivel"]);var r=parseInt(e["puntos"]);var i=parseInt(e["partidas"]);var s=parseInt(e["aciertos"]);var o=parseInt(e["errores"]);var u={1:0,2:100,3:250,4:365,5:574,6:892,7:1389,8:2162,9:3366,10:5240,11:8158,12:12701,13:19774,14:30786,15:47931,16:74624,17:116183,18:180887,19:281626,20:42e4};this.get_puntos=function(){return r};this.borrar_puntos=function(){r=0};this.add_puntos=function(e){r+=e};this.get_nombre_jugador=function(){return t};this.set_nombre_jugador=function(e){t=e};this.sumar_partida=function(){i++};this.get_partidas=function(){return i};this.sumar_acierto=function(e){s+=e};this.get_aciertos=function(){return s};this.sumar_error=function(e){o+=e};this.get_errores=function(){return o};this.set_nivel=function(){if(this.get_puntos()>u[this.get_nivel()+1]){n++}};this.get_nivel=function(){return n};this.get_puntos_proximo_nivel=function(){if(this.get_nivel()==20){proximo_nivel="-"}else{proximo_nivel=u[this.get_nivel()+1]-this.get_puntos()}return proximo_nivel};this.get_datos=function(){e={};e["nombre_jugador"]=this.get_nombre_jugador();e["nivel"]=this.get_nivel();e["puntos"]=this.get_puntos();e["partidas"]=i;e["aciertos"]=s;e["errores"]=o;return e}};var Juego=function(e){var t=e;var n="";var r="";var s=t.length;var o=6;var u=0;var a=false;var f=12;var l=11;for(cont=0;cont<t.length;cont++){r+="_"}this.sub_vida=function(){o--};this.get_vidas=function(){return o};this.get_intentos=function(){return n};this.set_intentos=function(e){n+=e};this.get_progreso=function(){return r};this.set_progreso=function(e,t){r=r.substr(0,t)+e+r.substr(t+1)};this.get_restantes=function(){return s};this.sumar_puntos=function(){u+=f};this.restar_puntos=function(){u-=l};this.probar_letra=function(e){resultados={aciertos:0,errores:0};valida=e.match(/[A-Z]/i)||e=="ñ"?true:false;if(valida&&n.indexOf(e)==-1&&o>0&&s>0&&!this.get_juego_finalizado()){this.set_intentos(e);exito=false;for(i=0;i<t.length;i++){if(e==t[i]){this.set_progreso(e,i);s--;exito=true;this.sumar_puntos();resultados["aciertos"]++}}if(!exito){this.sub_vida();this.restar_puntos();resultados["errores"]=1}}return resultados};this.get_juego_finalizado=function(){return a};this.terminar_juego=function(){r=t;o=0;a=true;return u}};var gui