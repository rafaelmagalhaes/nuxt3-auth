import{e as p,i as a,s as _,r as m,j as f,b as h,k as e,w as l,v as r,u as n,l as w,o as v}from"./entry.5ddbaaaa.js";const b=e("div",{class:"title"},[e("h2",null,"Login")],-1),g={class:"container form"},k=e("label",{for:"uname"},[e("b",null,"Username")],-1),x=e("label",{for:"psw"},[e("b",null,"Password")],-1),y=["onClick"],E=p({__name:"login",setup(U){const{authenticateUser:i}=a(),{authenticated:u}=_(a()),s=m({username:"kminchelle",password:"0lelplR"}),d=f(),c=async()=>{await i(s.value),u&&d.push("/")};return(B,t)=>(v(),h("div",null,[b,e("div",g,[k,l(e("input",{"onUpdate:modelValue":t[0]||(t[0]=o=>n(s).username=o),type:"text",class:"input",placeholder:"Enter Username",name:"uname",required:""},null,512),[[r,n(s).username]]),x,l(e("input",{"onUpdate:modelValue":t[1]||(t[1]=o=>n(s).password=o),type:"password",class:"input",placeholder:"Enter Password",name:"psw",required:""},null,512),[[r,n(s).password]]),e("button",{onClick:w(c,["prevent"]),class:"button"},"Login",8,y)])]))}});export{E as default};