"use strict";(self["webpackChunkquasarapp"]=self["webpackChunkquasarapp"]||[]).push([[311],{5311:(e,a,n)=>{n.r(a),n.d(a,{default:()=>N});var l=n(3673);const o={class:"q-py-lg"},t={class:"row"},s={class:"col-12 q-px-sm"};function d(e,a,n,d,i,r){const c=(0,l.up)("tree-view-meals"),m=(0,l.up)("q-drawer"),u=(0,l.up)("planning"),p=(0,l.up)("q-btn"),g=(0,l.up)("q-page-sticky"),w=(0,l.up)("q-page");return(0,l.wg)(),(0,l.j4)(w,{class:"q-pa-md"},{default:(0,l.w5)((()=>[(0,l.Wm)("div",o,[(0,l.Wm)(m,{modelValue:d.leftDrawerTreeViewOpen,"onUpdate:modelValue":a[1]||(a[1]=e=>d.leftDrawerTreeViewOpen=e),id:"tree",ref:"tree","show-if-above":"",bordered:"",class:"bg-grey-1 q-pa-md"},{default:(0,l.w5)((()=>[(0,l.Wm)(c,{onTouchstart:d.touchstart,onMousedown:d.mousedown,onMouseup:d.mouseup},null,8,["onTouchstart","onMousedown","onMouseup"])])),_:1},8,["modelValue"]),(0,l.Wm)("div",t,[(0,l.Wm)("div",s,[(0,l.Wm)(u)])])]),(0,l.Wm)(g,{position:"bottom-right",offset:[18,18]},{default:(0,l.w5)((()=>[(0,l.Wm)(p,{fab:"",icon:"add",color:"primary",onClick:d.toggleLeftDrawerTreeView},null,8,["onClick"])])),_:1})])),_:1})}var i=n(1959),r=n(2323);const c=(0,l.HX)("data-v-66f335d1");(0,l.dD)("data-v-66f335d1");const m={id:"TreeViewMeals"},u=(0,l.uE)('<h4 class="text-center q-ma-none" data-v-66f335d1>Platos</h4><div class="q-py-md" data-v-66f335d1></div><div class="row no-wrap items-end" data-v-66f335d1><div class="col-8" data-v-66f335d1></div><div class="col-4 q-ml-sm" data-v-66f335d1></div></div>',3),p={class:"row q-mt-md"},g={class:"col-12"},w={class:"row items-center justify-between full-width"},v={class:"text-weight-bold text-h6",color:"primary"},h={class:"\n\t\t\t\t\t\t\t\t\t\t\t\t\thandle\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext-black text-left\n\t\t\t\t\t\t\t\t\t\t\t\t\tbg-transparent\n\t\t\t\t\t\t\t\t\t\t\t\t"};(0,l.Cn)();const f=c(((e,a,n,o,t,s)=>{const d=(0,l.up)("q-icon"),i=(0,l.up)("draggable"),f=(0,l.up)("q-tree");return(0,l.wg)(),(0,l.j4)("div",m,[u,(0,l.Wm)("div",p,[(0,l.Wm)("div",g,[(0,l.Wm)(f,{ref:"tree",nodes:o.categories,"node-key":"name","label-key":"name","children-key":"meals","v-model":o.expandedKeys,filter:o.filter,"default-expand":""},{"default-header":c((e=>[(0,l.Wm)("div",w,["undefined"===typeof e.node.category_id?((0,l.wg)(),(0,l.j4)(l.HY,{key:0},[(0,l.Wm)("span",v,(0,r.zw)(e.node.name),1),(0,l.Wm)(d,{class:"col-2",name:e.node.icon.path?"img:"+e.node.icon.path:""},null,8,["name"])],64)):((0,l.wg)(),(0,l.j4)(i,{key:1,list:[e],"item-key":e.node.name,group:{name:"meals",pull:"clone",put:!1}},{item:c((({element:e})=>[(0,l.Wm)("div",h,(0,r.zw)(e.node.name),1)])),_:2},1032,["list","item-key"]))])])),_:1},8,["nodes","v-model","filter"])])])])}));var y=n(5474),k=n(470),b=n.n(k);const W={name:"TreeViewMeals",components:{draggable:b()},setup(){(0,l.f3)("emitter");const e=(0,i.iH)([]),a=(0,i.iH)(!0),n=(0,i.iH)(!1),o=(0,i.iH)([]),t=(0,i.iH)("Abrir todos"),s=(0,i.iH)("");(0,l.wF)((()=>{d()}));const d=async()=>{await y.api.get("https://food-planning-back.herokuapp.com/api/categories").then((e=>{o.value=e.data.categories}))};return{expandedKeys:e,isExpanded:a,dragging:n,filter:s,collapseOpen:t,categories:o}}};var x=n(4842),q=n(4554),_=n(8240),P=n(5078),H=n(7030),V=n(7518),T=n.n(V);W.render=f,W.__scopeId="data-v-66f335d1";const D=W;T()(W,"components",{QInput:x.Z,QIcon:q.Z,QBtn:_.Z,QTree:P.Z,QChip:H.Z});n(71);const C=(0,l.HX)("data-v-6a24a6ce");(0,l.dD)("data-v-6a24a6ce");const I=(0,l.Wm)("h3",{class:"text-center q-mt-none q-mb-md"},"Planning",-1),M={class:"q-pa-md"},Z={class:""},j={class:"row justify-evenly"},Q={class:"row text-black text-left text-h4"},A={class:"q-ml-xs q-mt-xs"},z={class:"row items-center handle justify-between q-my-sm"},O={class:"col-8 q-pl-sm"};(0,l.Cn)();const E=C(((e,a,n,o,t,s)=>{const d=(0,l.up)("q-toggle"),i=(0,l.up)("q-icon"),c=(0,l.up)("q-expansion-item"),m=(0,l.up)("draggable");return(0,l.wg)(),(0,l.j4)("div",null,[I,(0,l.Wm)("div",M,[(0,l.Wm)(d,{modelValue:o.showResume,"onUpdate:modelValue":a[1]||(a[1]=e=>o.showResume=e),label:"Ver resumen"},null,8,["modelValue"])]),(0,l.Wm)("div",null,[(0,l.Wm)(c,{id:"resumeMeals",modelValue:o.showResume,"onUpdate:modelValue":a[2]||(a[2]=e=>o.showResume=e),dense:"","dense-toggle":""},{default:C((()=>[((0,l.wg)(!0),(0,l.j4)(l.HY,null,(0,l.Ko)(o.categories,(e=>{var a;return(0,l.wg)(),(0,l.j4)("div",{key:e.id},[(0,l.Wm)("div",Z,[(0,l.Wm)(i,{class:"meal-category-icons q-mr-sm",name:e.icon.path?"img:"+e.icon.path:""},null,8,["name"]),(0,l.Wm)("span",{class:e.optimum_number!=e.assigned?"text-red-6":"text-blue-6"},(0,r.zw)(e.name)+": "+(0,r.zw)(null!==(a=e.assigned)&&void 0!==a?a:0)+" / "+(0,r.zw)(e.optimum_number),3)])])})),128))])),_:1},8,["modelValue"])]),(0,l.Wm)("div",j,[((0,l.wg)(!0),(0,l.j4)(l.HY,null,(0,l.Ko)(o.planning,((e,a)=>((0,l.wg)(),(0,l.j4)("div",{class:"col-12 col-sm-5 col-lg-3 col-xl-auto planning-card q-pt-md q-px-md",key:`day-${a}`},[(0,l.Wm)("div",Q,(0,r.zw)(e.name),1),((0,l.wg)(!0),(0,l.j4)(l.HY,null,(0,l.Ko)(e.hours,((e,n)=>((0,l.wg)(),(0,l.j4)("div",{key:`div-mealHourId-${e.id}`,class:"q-ml-xs"},[(0,l.Wm)("div",{class:"text-h6 text-left meal-hours-tittle",style:[{font:"size 1.35rem"},n>0?"margin-top: -20px;":"margin-top: 10px;"]},(0,r.zw)(e.name),5),(0,l.Wm)("div",A,[(0,l.Wm)(m,{list:e.meals,"item-key":`mealHourId-${e.id}`,group:"meals",class:"q-pb-xl",onAdd:l=>o.addDragging(a,e.id,n),onChange:o.changeDragging},{item:C((({element:e})=>{var a;return[(0,l.Wm)("div",z,[(0,l.Wm)(i,{class:"meal-category-icons",name:e.icon_path?"img:"+e.icon_path:""},null,8,["name"]),(0,l.Wm)("span",O,(0,r.zw)(null!==(a=e.name)&&void 0!==a?a:e.node.name),1),(0,l.Wm)(i,{class:"meal-remove-icons",name:"clear",onClick:a=>o.removeMealPlanningDB(e)},null,8,["onClick"])])]})),_:2},1032,["list","item-key","onAdd","onChange"])])])))),128))])))),128))]),(0,l.Wm)("button",{onClick:a[3]||(a[3]=(...e)=>o.seeAllPlanningInConsole&&o.seeAllPlanningInConsole(...e))},"See All Planning"),(0,l.Wm)("button",{onClick:a[4]||(a[4]=(...e)=>o.deleteAllPlanning&&o.deleteAllPlanning(...e))},"Delete All Planning")])}));var K=n(515),R=n.n(K),B=n(8825);const S={name:"Planning",components:{draggable:b()},setup(){let e=(0,i.iH)({}),a=(0,i.iH)({}),n=(0,i.iH)({}),o=(0,i.iH)([]),t=(0,i.iH)(!1),s={};const d=(0,B.Z)();(0,l.wF)((()=>{r()}));const r=async()=>{await y.api.get("https://food-planning-back.herokuapp.com/api/planning").then((l=>{e.value=l.data.planning,a.value=l.data.mealTypes,n.value=l.data.mealHours,o.value=l.data.categories,c()}))},c=()=>{for(const a in e.value)e.value[a]["hours"].forEach((e=>{e["meals"].forEach((e=>{m(e)}))}))},m=(e,a=!0)=>{let n=o.value.findIndex((a=>a.id==e.category_id));-1!=n&&(o.value[n].assigned=null!=o.value[n].assigned?a?++o.value[n].assigned:--o.value[n].assigned:1)},u=e=>{k(e)?(s=f(e)?R()({},e.added.element):R()({},e.added.element.node),s.order=e.added.newIndex+1):b(e)?(s=R()({},e.moved.element),s.order=e.moved.newIndex+1,v()):h(e.removed.element)},p=(e,a,n)=>{console.log("addDragging dragging Planning...",e,a,n),s.day_of_week=e,s.meal_hour_id=a,g(n)},g=async a=>{d.loading.show(),await y.api.post("https://food-planning-back.herokuapp.com/api/planning",s).then((n=>{e.value[s.day_of_week]["hours"][a]["meals"]=n.data,m(s)})).catch((e=>{console.log(e)})),d.loading.hide()},w=a=>{let n;return e.value[a.day_of_week]["hours"].forEach(((e,l)=>{e.id==a.meal_hour_id&&(n=l)})),n},v=async()=>{d.loading.show();let a=w(s);await y.api.post("https://food-planning-back.herokuapp.com/api/update-order-planning",s).then((n=>{e.value[s.day_of_week]["hours"][a]["meals"]=n.data})).catch((e=>{console.log(e)})),d.loading.hide()},h=async(a,n=null)=>{d.loading.show(),null===n&&(n=w(a)),await y.api.delete("https://food-planning-back.herokuapp.com/api/planning/"+a.id).then((l=>{e.value[a.day_of_week]["hours"][n]["meals"]=l.data,m(a,!1)})).catch((e=>{console.error(e)})),d.loading.hide()},f=e=>!e.added.element.hasOwnProperty("key"),k=e=>e.hasOwnProperty("added"),b=e=>e.hasOwnProperty("moved"),W=()=>{console.log("All Planning",e.value),console.log("1-0",e.value[2]["hours"][1]["meals"])},x=async()=>{await y.api.delete("https://food-planning-back.herokuapp.com/api/delete-all-planning").then((a=>{e.value=a.data.planning,o.value.forEach((e=>{e.assigned=0}))})).catch((e=>{console.error(e)}))};return{planning:e,mealTypes:a,mealHours:n,categories:o,showResume:t,seeAllPlanningInConsole:W,deleteAllPlanning:x,addDragging:p,changeDragging:u,removeMealPlanningDB:h}}};var Y=n(8886),L=n(429),U=n(2471);S.render=E,S.__scopeId="data-v-6a24a6ce";const $=S;T()(S,"components",{QToggle:Y.Z,QExpansionItem:L.Z,QIcon:q.Z,QSlideTransition:U.Z});const F={name:"PlanningPage",components:{TreeViewMeals:D,Planning:$},setup(){let e=(0,i.iH)(!1),a="",n=(0,l.f3)("emitter");const o=(0,B.Z)();(0,l.bv)((()=>{n.on("closeTreeViewMealsDrawer",(()=>{e.value=!1}))}));const t=()=>{e.value=!e.value,n.emit("updateLeftDrawerTreeViewOpen",e.value)},s=()=>{console.log("Touch start"),a="mousedown",c()},d=()=>{console.log("Mouse down"),a="mousedown",c()},r=()=>{console.log("Mouse up"),a="mouseup"},c=()=>{console.log("checklastMouse"),console.log("Is mobile?",o.platform.is.mobile),console.log("Screen",o.screen),console.log("Is small?",o.screen.xs,o.screen.sm),(o.screen.xs||o.screen.sm)&&window.setTimeout((()=>{console.log("checklastMouse"),"mousedown"==a&&t()}),1e3)};return{leftDrawerTreeViewOpen:e,toggleLeftDrawerTreeView:t,touchstart:s,mousedown:d,mouseup:r}}};var X=n(4379),G=n(2901),J=n(1007);F.render=d;const N=F;T()(F,"components",{QPage:X.Z,QDrawer:G.Z,QPageSticky:J.Z,QBtn:_.Z})}}]);