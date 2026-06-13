var STD=[],ct='',ftype='';
function M(t){document.getElementById('main').innerHTML='<div class=empty>'+t+'</div>'}

// 展开版本为列表项
function flatten(){
  var r=[];
  STD.forEach(function(s){
    s.versions.forEach(function(v){
      r.push({code:s.code,title:s.title,type:s.type,category:s.category,version:v.v,status:v.status,abstract:v.abstract||s.versions[0].abstract,clauses:v.clauses||s.versions[0].clauses,allVersions:s.versions})
    })
  });
  return r
}

fetch('data.json').then(function(r){return r.json()}).then(function(d){STD=d;init()}).catch(function(){M('数据加载失败')});
function init(){
  var items=flatten();
  document.getElementById('stat').textContent=STD.length+' 条标准, '+items.length+' 个版本';
  var cats=[],s={};
  STD.forEach(function(x){if(!s[x.category]){s[x.category]=1;cats.push(x.category)}});
  cats.sort();
  document.getElementById('cats').innerHTML='<a class=on onclick=fc("",this)>全部</a>'+cats.map(function(c){return '<a onclick=fc("'+c+'",this)>'+c+'</a>'}).join('');
  show(items)
}
function ft(t,e){
  ftype=t;
  document.querySelectorAll('.tbar a').forEach(function(a){a.classList.remove('on')});
  e.classList.add('on');
  search()
}
function fc(c,e){ct=c;document.querySelectorAll('.cnav a').forEach(function(a){a.classList.remove('on')});e.classList.add('on');search()}
function search(){
  var q=document.getElementById('q').value.toLowerCase().trim();
  var items=flatten();
  if(ftype) items=items.filter(function(x){return x.type===ftype});
  if(ct) items=items.filter(function(x){return x.category===ct});
  if(q) items=items.filter(function(x){
    return (x.code+x.version).toLowerCase().indexOf(q)>=0||x.title.toLowerCase().indexOf(q)>=0||x.category.indexOf(q)>=0||(x.abstract||'').toLowerCase().indexOf(q)>=0||(x.clauses||[]).some(function(c){return(c.num+' '+c.title+' '+c.text).toLowerCase().indexOf(q)>=0})
  });
  show(items)
}
function show(r){
  if(!r.length){M('未找到');return}
  var h='<table><tr><th>标准号</th><th>标题</th><th>状态</th><th>类型</th><th>分类</th></tr>';
  r.forEach(function(x){
    var sc=x.status==='现行'?'st-g':(x.status==='废止'?'st-r':'st-y');
    h+='<tr><td class=code>'+x.code+'-'+x.version+'</td><td><a class=tl onclick=det("'+x.code+'","'+x.version+'")>'+x.title+'</a></td><td><span class="st '+sc+'">'+x.status+'</span></td><td>'+x.type+'</td><td>'+x.category+'</td></tr>'
  });
  h+='</table>';document.getElementById('main').innerHTML=h
}
function det(cd,ver){
  var s=STD.find(function(x){return x.code===cd});if(!s)return;
  var cv=s.versions.find(function(v){return v.v===ver})||s.versions[0];
  var sc=cv.status==='现行'?'st-g':(cv.status==='废止'?'st-r':'st-y');
  var h='<div class=det><span class=back onclick=search()>返回列表</span>';
  h+='<h2>'+s.code+'-'+cv.v+'</h2><h3>'+s.title+'</h3>';
  h+='<div class=meta><span>类型: '+s.type+'</span><span class="st '+sc+'">'+cv.status+'</span><span>分类: '+s.category+'</span></div>';
  if(cv.abstract) h+='<p class=abs>'+cv.abstract+'</p>';
  // 版本时间线
  h+='<div style=margin:16px 0;border-top:1px solid #e0e4e8;padding-top:12px><h4>版本历史</h4><div style=display:flex;gap:8px;flex-wrap:wrap;margin-top:8px>';
  s.versions.forEach(function(v){
    var vc=v.status==='现行'?'#d4edda':(v.status==='废止'?'#f8d7da':'#fff3cd');
    h+='<span style=padding:4px 10px;border-radius:4px;font-size:12px;background:'+vc+'">'+v.v+' · '+v.status+'</span>'
  });
  h+='</div></div>';
  // 条款
  if(cv.clauses&&cv.clauses.length){
    h+='<div class=clist><h4>条款</h4>';
    cv.clauses.forEach(function(c){h+='<div class=ci><span class=cn>'+(c.num||'')+'</span> '+(c.title?c.title+': ':'')+(c.text||'')+'</div>'});
    h+='</div>'
  }
  h+='</div>';document.getElementById('main').innerHTML=h;window.scrollTo(0,0)
}