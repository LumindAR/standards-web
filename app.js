var STD=[],ct='';
fetch('data.json').then(function(r){return r.json()}).then(function(d){STD=d;init()}).catch(function(){M('数据加载失败, 请刷新')});
function M(t){document.getElementById('main').innerHTML='<div class=empty>'+t+'</div>'}
function init(){
  document.getElementById('stat').textContent=STD.length+' 条标准';
  var cs=[],s={};
  STD.forEach(function(x){if(!s[x.category]){s[x.category]=1;cs.push(x.category)}});
  cs.sort();
  document.getElementById('cats').innerHTML='<a class=on onclick=fc("",this)>全部</a>'+cs.map(function(c){return '<a onclick=fc("'+c+'",this)>'+c+'</a>'}).join('');
  show(STD)
}
function fc(c,e){ct=c;document.querySelectorAll('.cnav a').forEach(function(a){a.classList.remove('on')});e.classList.add('on');search()}
function search(){
  var q=document.getElementById('q').value.toLowerCase().trim();
  var r=STD.filter(function(s){
    if(ct&&s.category!=ct)return false;if(!q)return true;
    return s.code.toLowerCase().indexOf(q)>=0||s.title.toLowerCase().indexOf(q)>=0||s.category.indexOf(q)>=0||(s.abstract||'').toLowerCase().indexOf(q)>=0||(s.clauses||[]).some(function(c){return(c.num+' '+c.title+' '+c.text).toLowerCase().indexOf(q)>=0})
  });
  show(r)
}
function show(r){
  if(!r.length){M('未找到匹配的标准');return}
  var h='<table><tr><th>标准号</th><th>标题</th><th>状态</th><th>分类</th></tr>';
  r.forEach(function(s){
    var sc=s.status=='现行'?'st-g':(s.status=='废止'?'st-r':'st-y');
    h+='<tr><td class=code>'+s.code+'</td><td><a class=tl onclick="det(\''+s.code+'\')">'+s.title+'</a></td><td><span class="st '+sc+'">'+s.status+'</span></td><td>'+s.category+'</td></tr>'
  });
  h+='</table>';document.getElementById('main').innerHTML=h
}
function det(code){
  var s=STD.find(function(x){return x.code===code});if(!s)return;
  var sc=s.status=='现行'?'st-g':(s.status=='废止'?'st-r':'st-y');
  var h='<div class=det><span class=back onclick=search()>返回列表</span>';
  h+='<h2>'+s.code+'</h2><h3>'+s.title+'</h3>';
  h+='<div class=meta><span>类型: '+(s.type||'GB/T')+'</span><span class="st '+sc+'">'+s.status+'</span><span>分类: '+s.category+'</span></div>';
  if(s.abstract)h+='<p class=abs>'+s.abstract+'</p>';
  if(s.clauses&&s.clauses.length){
    h+='<div class=clist><h4>条款</h4>';
    s.clauses.forEach(function(c){h+='<div class=ci><span class=cn>'+(c.num||'')+'</span> '+(c.title?c.title+': ':'')+(c.text||'')+'</div>'});
    h+='</div>'
  }
  h+='</div>';document.getElementById('main').innerHTML=h;window.scrollTo(0,0)
}