﻿(function(a,j,h){var c=null,e=null,d=true;
var g={tit:"提示信息",w:{"*":"不能为空！","*6-16":"请填写6到16位任意字符！",n:"请填写数字！","n6-16":"请填写6到16位数字！",s:"不能输入特殊字符！","s6-18":"请填写6到18位字符！",p:"请填写邮政编码！",m:"请填写手机号码！",e:"邮箱地址格式不对！",url:"请填写网址！"},def:"请填写正确信息！",undef:"datatype未定义！",reck:"两次输入的内容不一致！",r:"通过信息验证！",c:"正在检测信息…",s:"请{填写|选择}{0|信息}！",v:"所填信息没有经过验证，请稍后…",p:"正在提交数据…"};
a.Tipmsg=g;
var i=function(l,n,m){var n=a.extend({},i.defaults,n);
n.datatype&&a.extend(i.util.dataType,n.datatype);
var k=this;
k.tipmsg={w:{}};
k.forms=l;
k.objects=[];
if(m===true){return false
}l.each(function(){if(this.validform_inited=="inited"){return true
}this.validform_inited="inited";
var p=this;
p.settings=a.extend({},n);
var o=a(p);
p.validform_status="normal";
o.data("tipmsg",k.tipmsg);
o.delegate("[datatype]","blur",function(){var q=arguments[1];
i.util.check.call(this,o,q)
});
o.delegate(":text","keypress",function(q){if(q.keyCode==13&&o.find(":submit").length==0){o.submit()
}});
i.util.enhance.call(o,p.settings.tiptype,p.settings.usePlugin,p.settings.tipSweep);
p.settings.btnSubmit&&o.find(p.settings.btnSubmit).bind("click",function(){o.trigger("submit");
return false
});
o.submit(function(){var q=i.util.submitForm.call(o,p.settings);
q===h&&(q=true);
return q
});
o.find("[type='reset']").add(o.find(p.settings.btnReset)).bind("click",function(){i.util.resetForm.call(o)
})
});
if(n.tiptype==1||(n.tiptype==2||n.tiptype==3)&&n.ajaxPost){b()
}};
i.defaults={tiptype:1,tipSweep:false,showAllError:false,postonce:false,ajaxPost:false};
i.util={dataType:{"*":/[\w\W]+/,"*6-16":/^[\w\W]{6,16}$/,n:/^\d+$/,"n6-16":/^\d{6,16}$/,s:/^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]+$/,"s6-18":/^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]{6,18}$/,p:/^[0-9]{6}$/,m:/^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$/,e:/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,url:/^(\w+:\/\/)?\w+(\.\w+)+.*$/},toString:Object.prototype.toString,isEmpty:function(k){return k===""||k===a.trim(this.attr("tip"))
},getValue:function(m){var l,k=this;
if(m.is(":radio")){l=k.find(":radio[name='"+m.attr("name")+"']:checked").val();
l=l===h?"":l
}else{if(m.is(":checkbox")){l="";
k.find(":checkbox[name='"+m.attr("name")+"']:checked").each(function(){l+=a(this).val()+","
});
l=l===h?"":l
}else{l=m.val()
}}l=a.trim(l);
return i.util.isEmpty.call(m,l)?"":l
},enhance:function(n,o,m,k){var l=this;
l.find("[datatype]").each(function(){if(n==2){if(a(this).parent().next().find(".Validform_checktip").length==0){a(this).parent().next().append("<span class='Validform_checktip' />");
a(this).siblings(".Validform_checktip").remove()
}}else{if(n==3||n==4){if(a(this).siblings(".Validform_checktip").length==0){a(this).parent().append("<span class='Validform_checktip' />");
a(this).parent().next().find(".Validform_checktip").remove()
}}}});
l.find("input[recheck]").each(function(){if(this.validform_inited=="inited"){return true
}this.validform_inited="inited";
var p=a(this);
var q=l.find("input[name='"+a(this).attr("recheck")+"']");
q.bind("keyup",function(){if(q.val()==p.val()&&q.val()!=""){if(q.attr("tip")){if(q.attr("tip")==q.val()){return false
}}p.trigger("blur")
}}).bind("blur",function(){if(q.val()!=p.val()&&p.val()!=""){if(p.attr("tip")){if(p.attr("tip")==p.val()){return false
}}p.trigger("blur")
}})
});
l.find("[tip]").each(function(){if(this.validform_inited=="inited"){return true
}this.validform_inited="inited";
var q=a(this).attr("tip");
var p=a(this).attr("altercss");
a(this).focus(function(){if(a(this).val()==q){a(this).val("");
if(p){a(this).removeClass(p)
}}}).blur(function(){if(a.trim(a(this).val())===""){a(this).val(q);
if(p){a(this).addClass(p)
}}})
});
l.find(":checkbox[datatype],:radio[datatype]").each(function(){if(this.validform_inited=="inited"){return true
}this.validform_inited="inited";
var p=a(this);
var q=p.attr("name");
l.find("[name='"+q+"']").filter(":checkbox,:radio").bind("click",function(){setTimeout(function(){p.trigger("blur")
},0)
})
});
l.find("select[datatype][multiple]").bind("click",function(){var p=a(this);
setTimeout(function(){p.trigger("blur")
},0)
});
i.util.usePlugin.call(l,o,n,m,k)
},usePlugin:function(q,s,r,k){var l=this,q=q||{};
if(l.find("input[plugin='swfupload']").length&&typeof(swfuploadhandler)!="undefined"){var m={custom_settings:{form:l,showmsg:function(t,v,u){i.util.showmsg.call(l,t,s,{obj:l.find("input[plugin='swfupload']"),type:v,sweep:r})
}}};
m=a.extend(true,{},q.swfupload,m);
l.find("input[plugin='swfupload']").each(function(t){if(this.validform_inited=="inited"){return true
}this.validform_inited="inited";
a(this).val("");
swfuploadhandler.init(m,t)
})
}if(l.find("input[plugin='datepicker']").length&&a.fn.datePicker){q.datepicker=q.datepicker||{};
if(q.datepicker.format){Date.format=q.datepicker.format;
delete q.datepicker.format
}if(q.datepicker.firstDayOfWeek){Date.firstDayOfWeek=q.datepicker.firstDayOfWeek;
delete q.datepicker.firstDayOfWeek
}l.find("input[plugin='datepicker']").each(function(t){if(this.validform_inited=="inited"){return true
}this.validform_inited="inited";
q.datepicker.callback&&a(this).bind("dateSelected",function(){var u=new Date(a.event._dpCache[this._dpId].getSelected()[0]).asString(Date.format);
q.datepicker.callback(u,this)
});
a(this).datePicker(q.datepicker)
})
}if(l.find("input[plugin*='passwordStrength']").length&&a.fn.passwordStrength){q.passwordstrength=q.passwordstrength||{};
q.passwordstrength.showmsg=function(u,t,v){i.util.showmsg.call(l,t,s,{obj:u,type:v,sweep:r})
};
l.find("input[plugin='passwordStrength']").each(function(t){if(this.validform_inited=="inited"){return true
}this.validform_inited="inited";
a(this).passwordStrength(q.passwordstrength)
})
}if(k!="addRule"&&q.jqtransform&&a.fn.jqTransSelect){if(l[0].jqTransSelected=="true"){return
}l[0].jqTransSelected="true";
var p=function(t){var u=a(".jqTransformSelectWrapper ul:visible");
u.each(function(){var v=a(this).parents(".jqTransformSelectWrapper:first").find("select").get(0);
if(!(t&&v.oLabel&&v.oLabel.get(0)==t.get(0))){a(this).hide()
}})
};
var o=function(t){if(a(t.target).parents(".jqTransformSelectWrapper").length===0){p(a(t.target))
}};
var n=function(){a(document).mousedown(o)
};
if(q.jqtransform.selector){l.find(q.jqtransform.selector).filter('input:submit, input:reset, input[type="button"]').jqTransInputButton();
l.find(q.jqtransform.selector).filter("input:text, input:password").jqTransInputText();
l.find(q.jqtransform.selector).filter("input:checkbox").jqTransCheckBox();
l.find(q.jqtransform.selector).filter("input:radio").jqTransRadio();
l.find(q.jqtransform.selector).filter("textarea").jqTransTextarea();
if(l.find(q.jqtransform.selector).filter("select").length>0){l.find(q.jqtransform.selector).filter("select").jqTransSelect();
n()
}}else{l.jqTransform()
}l.find(".jqTransformSelectWrapper").find("li a").click(function(){a(this).parents(".jqTransformSelectWrapper").find("select").trigger("blur")
})
}},getNullmsg:function(k){var n=this;
var o=/[\u4E00-\u9FA5\uf900-\ufa2da-zA-Z\s]+/g;
var m;
var l=k[0].settings.label||".Validform_label";
l=n.siblings(l).eq(0).text()||n.siblings().find(l).eq(0).text()||n.parent().siblings(l).eq(0).text()||n.parent().siblings().find(l).eq(0).text();
l=l.replace(/\s(?![a-zA-Z])/g,"").match(o);
l=l?l.join(""):[""];
o=/\{(.+)\|(.+)\}/;
m=k.data("tipmsg").s||g.s;
if(l!=""){m=m.replace(/\{0\|(.+)\}/,l);
if(n.attr("recheck")){m=m.replace(/\{(.+)\}/,"");
n.attr("nullmsg",m);
return m
}}else{m=n.is(":checkbox,:radio,select")?m.replace(/\{0\|(.+)\}/,""):m.replace(/\{0\|(.+)\}/,"$1")
}m=n.is(":checkbox,:radio,select")?m.replace(o,"$2"):m.replace(o,"$1");
n.attr("nullmsg",m);
return m
},getErrormsg:function(k,l,o){var p=/^(.+?)((\d+)-(\d+))?$/,q=/^(.+?)(\d+)-(\d+)$/,r=/(.*?)\d+(.+?)\d+(.*)/,m=l.match(p),t,s;
if(o=="recheck"){s=k.data("tipmsg").reck||g.reck;
return s
}var u=a.extend({},g.w,k.data("tipmsg").w);
if(m[0] in u){return k.data("tipmsg").w[m[0]]||g.w[m[0]]
}for(var n in u){if(n.indexOf(m[1])!=-1&&q.test(n)){s=(k.data("tipmsg").w[n]||g.w[n]).replace(r,"$1"+m[3]+"$2"+m[4]+"$3");
k.data("tipmsg").w[m[0]]=s;
return s
}}return k.data("tipmsg").def||g.def
},_regcheck:function(l,m,q,k){var k=k,n=null,s=false,t=/\/.+\//g,u=/^(.+?)(\d+)-(\d+)$/,B=3;
if(t.test(l)){var v=l.match(t)[0].slice(1,-1);
var r=l.replace(t,"");
var x=RegExp(v,r);
s=x.test(m)
}else{if(i.util.toString.call(i.util.dataType[l])=="[object Function]"){s=i.util.dataType[l](m,q,k,i.util.dataType);
if(s===true||s===h){s=true
}else{n=s;
s=false
}}else{if(!(l in i.util.dataType)){var o=l.match(u),z;
if(!o){s=false;
n=k.data("tipmsg").undef||g.undef
}else{for(var p in i.util.dataType){z=p.match(u);
if(!z){continue
}if(o[1]===z[1]){var y=i.util.dataType[p].toString(),r=y.match(/\/[mgi]*/g)[1].replace("/",""),w=new RegExp("\\{"+z[2]+","+z[3]+"\\}","g");
y=y.replace(/\/[mgi]*/g,"/").replace(w,"{"+o[2]+","+o[3]+"}").replace(/^\//,"").replace(/\/$/,"");
i.util.dataType[l]=new RegExp(y,r);
break
}}}}if(i.util.toString.call(i.util.dataType[l])=="[object RegExp]"){s=i.util.dataType[l].test(m)
}}}if(s){B=2;
n=q.attr("sucmsg")||k.data("tipmsg").r||g.r;
if(q.attr("recheck")){var A=k.find("input[name='"+q.attr("recheck")+"']:first");
if(m!=A.val()){s=false;
B=3;
n=q.attr("errormsg")||i.util.getErrormsg.call(q,k,l,"recheck")
}}}else{n=n||q.attr("errormsg")||i.util.getErrormsg.call(q,k,l);
if(i.util.isEmpty.call(q,m)){n=q.attr("nullmsg")||i.util.getNullmsg.call(q,k)
}}return{passed:s,type:B,info:n}
},regcheck:function(l,p,r){var k=this,q=null,s=false,u=3;
if(r.attr("ignore")==="ignore"&&i.util.isEmpty.call(r,p)){if(r.data("cked")){q=""
}return{passed:true,type:4,info:q}
}r.data("cked","cked");
var n=i.util.parseDatatype(l);
var t;
for(var o=0;
o<n.length;
o++){for(var m=0;
m<n[o].length;
m++){t=i.util._regcheck(n[o][m],p,r,k);
if(!t.passed){break
}}if(t.passed){break
}}return t
},parseDatatype:function(l){var r=/\/.+?\/[mgi]*(?=(,|$|\||\s))|[\w\*-]+/g,o=l.match(r),s=l.replace(r,"").replace(/\s*/g,"").split(""),k=[],p=0;
k[0]=[];
k[0].push(o[0]);
for(var q=0;
q<s.length;
q++){if(s[q]=="|"){p++;
k[p]=[]
}k[p].push(o[q+1])
}return k
},showmsg:function(k,n,l,m){if(k==h){return
}if(m=="bycheck"&&l.sweep&&(l.obj&&!l.obj.is(".Validform_error")||typeof n=="function")){return
}a.extend(l,{curform:this});
if(typeof n=="function"){n(k,l,i.util.cssctl);
return
}if(n==1||m=="byajax"&&n!=4){e.find(".Validform_info").html(k)
}if(n==1&&m!="bycheck"&&l.type!=2||m=="byajax"&&n!=4){d=false;
e.find(".iframe").css("height",e.outerHeight());
e.show();
f(e,100)
}if(n==2&&l.obj){l.obj.parent().next().find(".Validform_checktip").html(k);
i.util.cssctl(l.obj.parent().next().find(".Validform_checktip"),l.type)
}if((n==3||n==4)&&l.obj){l.obj.siblings(".Validform_checktip").html(k);
i.util.cssctl(l.obj.siblings(".Validform_checktip"),l.type)
}},cssctl:function(k,l){switch(l){case 1:k.removeClass("Validform_right Validform_wrong").addClass("Validform_checktip Validform_loading");
break;
case 2:k.removeClass("Validform_wrong Validform_loading").addClass("Validform_checktip Validform_right");
break;
case 4:k.removeClass("Validform_right Validform_wrong Validform_loading").addClass("Validform_checktip");
break;
default:k.removeClass("Validform_right Validform_loading").addClass("Validform_checktip Validform_wrong")
}},check:function(o,u,n){var t=o[0].settings;
var u=u||"";
var r=i.util.getValue.call(o,a(this));
if(t.ignoreHidden&&a(this).is(":hidden")||a(this).data("dataIgnore")==="dataIgnore"){return true
}if(t.dragonfly&&!a(this).data("cked")&&i.util.isEmpty.call(a(this),r)&&a(this).attr("ignore")!="ignore"){return false
}var p=i.util.regcheck.call(o,a(this).attr("datatype"),r,a(this));
if(r==this.validform_lastval&&!a(this).attr("recheck")&&u==""){return p.passed?true:false
}this.validform_lastval=r;
var k;
c=k=a(this);
if(!p.passed){i.util.abort.call(k[0]);
if(!n){i.util.showmsg.call(o,p.info,t.tiptype,{obj:a(this),type:p.type,sweep:t.tipSweep},"bycheck");
!t.tipSweep&&k.addClass("Validform_error")
}return false
}var m=a(this).attr("ajaxurl");
if(m&&!i.util.isEmpty.call(a(this),r)&&!n){var q=a(this);
if(u=="postform"){q[0].validform_subpost="postform"
}else{q[0].validform_subpost=""
}if(q[0].validform_valid==="posting"&&r==q[0].validform_ckvalue){return"ajax"
}q[0].validform_valid="posting";
q[0].validform_ckvalue=r;
i.util.showmsg.call(o,o.data("tipmsg").c||g.c,t.tiptype,{obj:q,type:1,sweep:t.tipSweep},"bycheck");
i.util.abort.call(k[0]);
var l=a.extend(true,{},t.ajaxurl||{});
var s={type:"POST",cache:false,url:m,data:"param="+encodeURIComponent(r)+"&name="+encodeURIComponent(a(this).attr("name")),success:function(x){if(a.trim(x.status)==="y"){q[0].validform_valid="true";
x.info&&q.attr("sucmsg",x.info);
i.util.showmsg.call(o,q.attr("sucmsg")||o.data("tipmsg").r||g.r,t.tiptype,{obj:q,type:2,sweep:t.tipSweep},"bycheck");
k.removeClass("Validform_error");
c=null;
if(q[0].validform_subpost=="postform"){o.trigger("submit")
}}else{q[0].validform_valid=x.info;
i.util.showmsg.call(o,x.info,t.tiptype,{obj:q,type:3,sweep:t.tipSweep});
k.addClass("Validform_error")
}k[0].validform_ajax=null
},error:function(x){if(x.status=="200"){if(x.responseText=="y"){l.success({status:"y"})
}else{l.success({status:"n",info:x.responseText})
}return false
}if(x.statusText!=="abort"){var y="status: "+x.status+"; statusText: "+x.statusText;
i.util.showmsg.call(o,y,t.tiptype,{obj:q,type:3,sweep:t.tipSweep});
k.addClass("Validform_error")
}q[0].validform_valid=x.statusText;
k[0].validform_ajax=null;
return true
}};
if(l.success){var w=l.success;
l.success=function(x){s.success(x);
w(x,q)
}
}if(l.error){var v=l.error;
l.error=function(x){s.error(x)&&v(x,q)
}
}l=a.extend({},s,l,{dataType:"json"});
k[0].validform_ajax=a.ajax(l);
return"ajax"
}else{if(m&&i.util.isEmpty.call(a(this),r)){i.util.abort.call(k[0]);
k[0].validform_valid="true"
}}if(!n){i.util.showmsg.call(o,p.info,t.tiptype,{obj:a(this),type:p.type,sweep:t.tipSweep},"bycheck");
k.removeClass("Validform_error")
}c=null;
return true
},submitForm:function(t,q,x,k,u){var o=this;
if(o[0].validform_status==="posting"){return false
}if(t.postonce&&o[0].validform_status==="posted"){return false
}var m=t.beforeCheck&&t.beforeCheck(o);
if(m===false){return false
}var p=true,r;
o.find("[datatype]").each(function(){if(q){return false
}if(t.ignoreHidden&&a(this).is(":hidden")||a(this).data("dataIgnore")==="dataIgnore"){return true
}var z=i.util.getValue.call(o,a(this)),y;
c=y=a(this);
r=i.util.regcheck.call(o,a(this).attr("datatype"),z,a(this));
if(!r.passed){i.util.showmsg.call(o,r.info,t.tiptype,{obj:a(this),type:r.type,sweep:t.tipSweep});
y.addClass("Validform_error");
if(!t.showAllError){y.focus();
p=false;
return false
}p&&(p=false);
return true
}if(a(this).attr("ajaxurl")&&!i.util.isEmpty.call(a(this),z)){if(this.validform_valid!=="true"){var A=a(this);
i.util.showmsg.call(o,o.data("tipmsg").v||g.v,t.tiptype,{obj:A,type:3,sweep:t.tipSweep});
y.addClass("Validform_error");
A.trigger("blur",["postform"]);
if(!t.showAllError){p=false;
return false
}p&&(p=false);
return true
}}else{if(a(this).attr("ajaxurl")&&i.util.isEmpty.call(a(this),z)){i.util.abort.call(this);
this.validform_valid="true"
}}i.util.showmsg.call(o,r.info,t.tiptype,{obj:a(this),type:r.type,sweep:t.tipSweep});
y.removeClass("Validform_error");
c=null
});
if(t.showAllError){o.find(".Validform_error:first").focus()
}if(p){var n=t.beforeSubmit&&t.beforeSubmit(o);
if(n===false){return false
}o[0].validform_status="posting";
if(t.ajaxPost||k==="ajaxPost"){var l=a.extend(true,{},t.ajaxpost||{});
l.url=x||l.url||t.url||o.attr("action");
i.util.showmsg.call(o,o.data("tipmsg").p||g.p,t.tiptype,{obj:o,type:1,sweep:t.tipSweep},"byajax");
if(u){l.async=false
}else{if(u===false){l.async=true
}}if(l.success){var w=l.success;
l.success=function(y){t.callback&&t.callback(y);
o[0].validform_ajax=null;
if(a.trim(y.status)==="y"){o[0].validform_status="posted"
}else{o[0].validform_status="normal"
}w(y,o)
}
}if(l.error){var v=l.error;
l.error=function(y){t.callback&&t.callback(y);
o[0].validform_status="normal";
o[0].validform_ajax=null;
v(y,o)
}
}var s={type:"POST",async:true,data:o.serializeArray(),success:function(y){if(a.trim(y.status)==="y"){o[0].validform_status="posted";
i.util.showmsg.call(o,y.info,t.tiptype,{obj:o,type:2,sweep:t.tipSweep},"byajax")
}else{o[0].validform_status="normal";
i.util.showmsg.call(o,y.info,t.tiptype,{obj:o,type:3,sweep:t.tipSweep},"byajax")
}t.callback&&t.callback(y);
o[0].validform_ajax=null
},error:function(y){var z="status: "+y.status+"; statusText: "+y.statusText;
i.util.showmsg.call(o,z,t.tiptype,{obj:o,type:3,sweep:t.tipSweep},"byajax");
t.callback&&t.callback(y);
o[0].validform_status="normal";
o[0].validform_ajax=null
}};
l=a.extend({},s,l,{dataType:"json"});
o[0].validform_ajax=a.ajax(l)
}else{if(!t.postonce){o[0].validform_status="normal"
}var x=x||t.url;
if(x){o.attr("action",x)
}return t.callback&&t.callback(o)
}}return false
},resetForm:function(){var k=this;
k.each(function(){this.reset&&this.reset();
this.validform_status="normal"
});
k.find(".Validform_right").text("");
k.find(".passwordStrength").children().removeClass("bgStrength");
k.find(".Validform_checktip").removeClass("Validform_wrong Validform_right Validform_loading");
k.find(".Validform_error").removeClass("Validform_error");
k.find("[datatype]").removeData("cked").removeData("dataIgnore").each(function(){this.validform_lastval=null
});
k.eq(0).find("input:first").focus()
},abort:function(){if(this.validform_ajax){this.validform_ajax.abort()
}}};
a.Datatype=i.util.dataType;
i.prototype={dataType:i.util.dataType,eq:function(k){var l=this;
if(k>=l.forms.length){return null
}if(!(k in l.objects)){l.objects[k]=new i(a(l.forms[k]).get(),{},true)
}return l.objects[k]
},resetStatus:function(){var k=this;
a(k.forms).each(function(){this.validform_status="normal"
});
return this
},setStatus:function(l){var k=this;
a(k.forms).each(function(){this.validform_status=l||"posting"
});
return this
},getStatus:function(){var k=this;
var l=a(k.forms)[0].validform_status;
return l
},ignore:function(l){var k=this;
var l=l||"[datatype]";
a(k.forms).find(l).each(function(){a(this).data("dataIgnore","dataIgnore").removeClass("Validform_error")
});
return this
},unignore:function(l){var k=this;
var l=l||"[datatype]";
a(k.forms).find(l).each(function(){a(this).removeData("dataIgnore")
});
return this
},addRule:function(p){var n=this;
var p=p||[];
for(var l=0;
l<p.length;
l++){var m=a(n.forms).find(p[l].ele);
for(var k in p[l]){k!=="ele"&&m.attr(k,p[l][k])
}}a(n.forms).each(function(){var o=a(this);
i.util.enhance.call(o,this.settings.tiptype,this.settings.usePlugin,this.settings.tipSweep,"addRule")
});
return this
},ajaxPost:function(k,m,n){var l=this;
a(l.forms).each(function(){if(this.settings.tiptype==1||this.settings.tiptype==2||this.settings.tiptype==3){b()
}i.util.submitForm.call(a(l.forms[0]),this.settings,k,n,"ajaxPost",m)
});
return this
},submitForm:function(k,m){var l=this;
a(l.forms).each(function(){var n=i.util.submitForm.call(a(this),this.settings,k,m);
n===h&&(n=true);
if(n===true){this.submit()
}});
return this
},resetForm:function(){var k=this;
i.util.resetForm.call(a(k.forms));
return this
},abort:function(){var k=this;
a(k.forms).each(function(){i.util.abort.call(this)
});
return this
},check:function(k,o){var o=o||"[datatype]",n=this,l=a(n.forms),m=true;
l.find(o).each(function(){i.util.check.call(this,l,"",k)||(m=false)
});
return m
},recheck:function(k,p){var p=p||"[datatype]",n=this,l=a(n.forms),m=true;
l.find(p).each(function(){if(!m){return
}i.util.check.call(this,l,"",k)||(m=false)
});
var o=a(l).find(".Validform_wrong").length==0;
return m&o
},config:function(l){var k=this;
l=l||{};
a(k.forms).each(function(){var m=a(this);
this.settings=a.extend(true,this.settings,l);
i.util.enhance.call(m,this.settings.tiptype,this.settings.usePlugin,this.settings.tipSweep)
});
return this
}};
a.fn.Validform=function(k){return new i(this,k)
};
function f(l,m){var k=(a(window).width()-l.outerWidth())/2,n=(a(window).height()-l.outerHeight())/2,n=(document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop)+(n>0?n:0);
l.css({left:k}).animate({top:n},{duration:m,queue:false})
}function b(){if(a("#Validform_msg").length!==0){return false
}e=a('<div id="Validform_msg"><div class="Validform_title">'+g.tit+'<a class="Validform_close" href="javascript:void(0);">&chi;</a></div><div class="Validform_info"></div><div class="iframe"><iframe frameborder="0" scrolling="no" height="100%" width="100%"></iframe></div></div>').appendTo("body");
e.find("a.Validform_close").click(function(){e.hide();
d=true;
if(c){c.focus().addClass("Validform_error")
}return false
}).focus(function(){this.blur()
});
a(window).bind("scroll resize",function(){!d&&f(e,400)
})
}a.Showmsg=function(k){b();
i.util.showmsg.call(j,k,1,{})
};
a.Hidemsg=function(){e.hide();
d=true
}
})(jQuery,window);