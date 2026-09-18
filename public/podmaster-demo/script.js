const players=[document.getElementById('raw'),document.getElementById('after')];
players.forEach(player=>{player.addEventListener('play',()=>players.forEach(other=>{if(other!==player)other.pause()}));player.addEventListener('error',()=>{document.getElementById('audio-error').hidden=false})});
['raw-wave','after-wave'].forEach((id,index)=>{const wave=document.getElementById(id);for(let n=0;n<64;n++){const bar=document.createElement('i');const shape=Math.abs(Math.sin(n*1.71)*Math.cos(n*.27));bar.style.height=(index?20+shape*59:7+shape*48)+'px';wave.appendChild(bar)}});
