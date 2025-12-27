"use client";

import Script from "next/script";
import { ReactNode } from "react";

import { GA_TRACKING_ID, useGoogleAnalytics } from "../lib/useGoogleAnalytics";
import { useTypeSquareJS } from "../lib/useTypeSquareJS";

export function RootLayoutClient({ children }: { children: ReactNode }) {
  useTypeSquareJS();
  useGoogleAnalytics();

  return (
    <>
      <Script
        id="typekit"
        dangerouslySetInnerHTML={{
          __html: `(function(d){var config={kitId:"tor0txx",scriptTimeout:3000,async:true},h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)})(document);`
        }}
      />
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_TRACKING_ID}');`
        }}
      />
      <Script
        id="twitter"
        dangerouslySetInnerHTML={{
          __html: `window.twttr=(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],t=window.twttr||{};if(d.getElementById(id))return t;js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);t._e=[];t.ready=function(f){t._e.push(f);};return t;}(document,"script","twitter-wjs"));`
        }}
      />
      {children}
    </>
  );
}
